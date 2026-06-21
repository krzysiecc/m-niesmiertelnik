from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Body, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from . import crud, schemas, models
from .database import Base, engine, get_db
from .config import settings
from .security import (
    get_password_hash, verify_password, create_jwt_token,
    create_access_token, decode_access_token, double_sha256_hash,
)
from fastapi.middleware.cors import CORSMiddleware
import json
import logging

logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hackathon Backend API", version="1.0.0")

bearer = HTTPBearer()


# Background task for cleaning up expired IDs.
def cleanup_expired_ids_task(db: Session):
    """Background task that removes expired user IDs."""
    crud.cleanup_expired_ids(db)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> models.User:
    """Resolve the authenticated user from the bearer access token."""
    try:
        user_id = decode_access_token(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = crud.get_user_by_user_id(db, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user


def require_owner(path_user_id: str, current_user: models.User) -> None:
    """Ensure the authenticated user owns the targeted account."""
    if current_user.user_id != path_user_id:
        raise HTTPException(status_code=403, detail="Not authorized for this account")


def require_admin(x_admin_key: str = Header(None, alias="X-Admin-Key")) -> None:
    """Guard admin endpoints with the configured admin API key."""
    if not settings.admin_api_key or x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=403, detail="Admin access denied")


@app.get("/")
def read_root():
    return {"message": "Server is running", "version": "1.0.0"}


# === LIFECYCLE ENDPOINTS ===

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check whether the login already exists.
    existing_user = crud.get_user_by_login(db, user.login)
    if existing_user:
        raise HTTPException(status_code=400, detail="Login already registered")

    hashed_password = get_password_hash(user.password)
    db_user = crud.create_user(db=db, user=user, hashed_password=hashed_password)

    response = schemas.UserResponse.model_validate(db_user)
    response.access_token = create_access_token(db_user.user_id)
    return response


@app.post("/login", response_model=schemas.UserResponse)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user."""
    db_user = crud.get_user_by_login(db, user.login)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Login or password incorrect")

    response = schemas.UserResponse.model_validate(db_user)
    response.access_token = create_access_token(db_user.user_id)
    return response


@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Fetch a user's data by ID (including the token)."""
    require_owner(user_id, current_user)
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/new_id", response_model=schemas.NewIdResponse)
def generate_new_id(
    user_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Generate a new ID for the user (the old one is removed after 14 days)."""
    require_owner(user_id, current_user)
    # Find the user by the current ID.
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate the new ID.
    updated_user = crud.generate_new_user_id(db, db_user.login)
    if not updated_user:
        raise HTTPException(status_code=500, detail="Failed to generate new ID")

    # Schedule the cleanup task in the background.
    background_tasks.add_task(cleanup_expired_ids_task, db)

    return schemas.NewIdResponse(
        new_user_id=updated_user.user_id,
        message="New ID generated successfully. Old ID will be removed after 14 days."
    )


@app.post("/users/{user_id}/update", response_model=schemas.UserResponse)
def update_user_profile(
    user_id: str,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Update a user's data."""
    require_owner(user_id, current_user)
    # Find the user by ID.
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    updated_user = crud.update_user(db, db_user.login, user_update)
    if not updated_user:
        raise HTTPException(status_code=500, detail="Failed to update user")

    return updated_user


@app.post("/users/{user_id}/delete")
def delete_user_account(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Delete a user account and all associated data."""
    require_owner(user_id, current_user)
    # Find the user by ID.
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    success = crud.delete_user(db, db_user.login)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete user")

    return {"message": "User account deleted successfully"}


# === TOKEN ENDPOINTS ===

@app.post("/generateToken", response_model=schemas.FormDataResponse)
def generate_token(
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Accept arbitrary JSON, wrap it as a JWT, hash it and associate it with the current user."""
    try:
        json_data = json.dumps(data, ensure_ascii=False)
        jwt_token = create_jwt_token(data)
        encrypted_token = double_sha256_hash(jwt_token)
        crud.create_form_data(db, current_user.login, encrypted_token, json_data)
        # Associate the token with the current user.
        current_user.token = encrypted_token
        db.commit()
        db.refresh(current_user)
        return schemas.FormDataResponse(
            encrypted_token=encrypted_token
        )
    except Exception as e:
        logger.exception("Failed to generate token: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/decryptToken", response_model=schemas.TokenDecryptResponse)
def decrypt_token(request: schemas.TokenDecryptRequest, db: Session = Depends(get_db)):
    """Decrypt a token and return its data (this is the public paramedic-scan path)."""
    try:
        # Look up the stored form data by the hashed token.
        form_data = crud.get_form_data_by_token(db, request.encrypted_token)

        if not form_data:
            raise HTTPException(status_code=404, detail="Token not found or invalid")

        # Check whether the user is blocked (if the token is tied to a user).
        if form_data.user_login != "anonymous":
            user = crud.get_user_by_login(db, form_data.user_login)
            if user and user.is_blocked:
                raise HTTPException(status_code=403, detail="User account is blocked")

        # Return the original data.
        original_data = json.loads(form_data.original_data)

        return schemas.TokenDecryptResponse(
            data=original_data,
            status="success"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to decrypt token: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error")


# === ADMIN ENDPOINTS ===

@app.post("/admin/block_user/{user_id}")
def block_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Block a user (admin endpoint)."""
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.is_blocked = True
    db.commit()

    return {"message": f"User {db_user.login} has been blocked"}


@app.post("/admin/unblock_user/{user_id}")
def unblock_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: None = Depends(require_admin),
):
    """Unblock a user (admin endpoint)."""
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.is_blocked = False
    db.commit()

    return {"message": f"User {db_user.login} has been unblocked"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
