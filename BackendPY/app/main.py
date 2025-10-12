from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Body
from sqlalchemy.orm import Session
from . import crud, schemas
from .database import Base, engine, get_db
from .security import (
    get_password_hash, verify_password, create_jwt_token, decode_jwt_token,
    double_sha256_encrypt, generate_qr_data
)
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Dict, Any

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hackathon Backend API", version="1.0.0")

# Background task do czyszczenia starych ID
def cleanup_expired_ids_task(db: Session):
    """Zadanie w tle do czyszczenia wygasłych ID"""
    crud.cleanup_expired_ids(db)

@app.get("/")
def read_root():
    return {"message": "Serwer po poprawie działa!", "version": "1.0.0"}

# === LIFECYCLE ENDPOINTS ===

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Rejestracja nowego użytkownika"""
    # Sprawdź, czy login już istnieje
    existing_user = crud.get_user_by_login(db, user.login)
    if existing_user:
        raise HTTPException(status_code=400, detail="Login already registered")

    hashed_password = get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

@app.post("/login", response_model=schemas.UserResponse)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Logowanie użytkownika"""
    db_user = crud.get_user_by_login(db, user.login)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Login or password incorrect")
    return db_user

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    """Pobranie danych użytkownika po ID"""
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users/{user_id}/new_id", response_model=schemas.NewIdResponse)
def generate_new_id(user_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Generowanie nowego ID dla użytkownika (stare zostanie usunięte po 14 dniach)"""
    # Znajdź użytkownika po obecnym ID
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Wygeneruj nowe ID
    updated_user = crud.generate_new_user_id(db, db_user.login)
    if not updated_user:
        raise HTTPException(status_code=500, detail="Failed to generate new ID")
    
    # Uruchom zadanie czyszczenia w tle
    background_tasks.add_task(cleanup_expired_ids_task, db)
    
    return schemas.NewIdResponse(
        new_user_id=updated_user.user_id,
        message="New ID generated successfully. Old ID will be removed after 14 days."
    )

@app.post("/users/{user_id}/update", response_model=schemas.UserResponse)
def update_user_profile(user_id: str, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    """Aktualizacja danych użytkownika"""
    # Znajdź użytkownika po ID
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = crud.update_user(db, db_user.login, user_update)
    if not updated_user:
        raise HTTPException(status_code=500, detail="Failed to update user")
    
    return updated_user

@app.post("/users/{user_id}/delete")
def delete_user_account(user_id: str, db: Session = Depends(get_db)):
    """Usunięcie konta użytkownika i wszystkich powiązanych danych"""
    # Znajdź użytkownika po ID
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
    db: Session = Depends(get_db)
):
    """Przyjmuje dowolny JSON, zamienia na JWT i szyfruje oraz przypisuje token do usera jeśli podano user_id."""
    try:
        user_login = "anonymous"
        user_id = data.get("user_id")
        if user_id:
            user = crud.get_user_by_user_id(db, user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            user_login = user.login
        json_data = json.dumps(data, ensure_ascii=False)
        jwt_token = create_jwt_token(data)
        encrypted_token = double_sha256_encrypt(jwt_token)
        crud.create_form_data(db, user_login, encrypted_token, json_data)
        # Jeśli user_id podano, przypisz token do usera
        if user_id:
            user.token = encrypted_token
            db.commit()
            db.refresh(user)
        return schemas.FormDataResponse(
            encrypted_token=encrypted_token
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate token: {str(e)}")

@app.post("/decryptToken", response_model=schemas.TokenDecryptResponse)
def decrypt_token(request: schemas.TokenDecryptRequest, db: Session = Depends(get_db)):
    """Dekryptowanie tokenu i zwracanie danych (sprawdza status blokady)"""
    try:
        # Szukamy w bazie danych po zaszyfrowanym tokenie (hash)
        form_data = crud.get_form_data_by_token(db, request.encrypted_token)
        
        if not form_data:
            raise HTTPException(status_code=404, detail="Token not found or invalid")
        
        # Sprawdź czy użytkownik jest zablokowany (jeśli token był powiązany z użytkownikiem)
        if form_data.user_login != "anonymous":
            user = crud.get_user_by_login(db, form_data.user_login)
            if user and user.is_blocked:
                raise HTTPException(status_code=403, detail="User account is blocked")
        
        # Zwróć oryginalne dane
        original_data = json.loads(form_data.original_data)
        
        return schemas.TokenDecryptResponse(
            data=original_data,
            status="success"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to decrypt token: {str(e)}")

# === ADMIN ENDPOINTS (opcjonalne) ===

@app.post("/admin/block_user/{user_id}")
def block_user(user_id: str, db: Session = Depends(get_db)):
    """Blokowanie użytkownika (admin endpoint)"""
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_blocked = True
    db.commit()
    
    return {"message": f"User {db_user.login} has been blocked"}

@app.post("/admin/unblock_user/{user_id}")
def unblock_user(user_id: str, db: Session = Depends(get_db)):
    """Odblokowanie użytkownika (admin endpoint)"""
    db_user = crud.get_user_by_user_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_blocked = False
    db.commit()
    
    return {"message": f"User {db_user.login} has been unblocked"}


origins = [
    "http://localhost:3000",  # Twój front w React podczas dev
    "http://127.0.0.1:3000",  # alternatywne localhost
    # możesz dodać też produkcyjne domeny np. "https://myfrontend.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # 👈 pozwala wszystkim domenom
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
