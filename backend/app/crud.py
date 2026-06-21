from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime, timezone
import uuid
from .security import get_password_hash


def _utcnow():
    return datetime.now(timezone.utc)


def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        login=user.login,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        date_of_birth=user.date_of_birth
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_login(db: Session, login: str):
    return db.query(models.User).filter(models.User.login == login).first()

def get_user_by_user_id(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def update_user(db: Session, login: str, user_update: schemas.UserUpdate):
    db_user = get_user_by_login(db, login)
    if not db_user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(db_user, field, value)

    db_user.updated_at = _utcnow()
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, login: str):
    db_user = get_user_by_login(db, login)
    if not db_user:
        return False

    # Also remove old IDs and form data.
    db.query(models.OldUserId).filter(models.OldUserId.user_login == login).delete()
    db.query(models.FormData).filter(models.FormData.user_login == login).delete()

    db.delete(db_user)
    db.commit()
    return True

def generate_new_user_id(db: Session, login: str):
    db_user = get_user_by_login(db, login)
    if not db_user:
        return None

    # Save the old ID into the old_user_ids table.
    old_id_record = models.OldUserId(
        user_login=login,
        old_user_id=db_user.user_id
    )
    db.add(old_id_record)

    # Generate the new ID.
    db_user.user_id = str(uuid.uuid4())
    db_user.updated_at = _utcnow()

    db.commit()
    db.refresh(db_user)

    return db_user

def cleanup_expired_ids(db: Session):
    """Remove expired old user IDs."""
    expired_threshold = _utcnow()
    deleted_count = db.query(models.OldUserId).filter(
        models.OldUserId.expires_at < expired_threshold
    ).delete()
    db.commit()
    return deleted_count

def create_form_data(db: Session, login: str, encrypted_token: str, original_data: str):
    form_data = models.FormData(
        user_login=login,
        encrypted_token=encrypted_token,
        original_data=original_data
    )
    db.add(form_data)
    db.commit()
    db.refresh(form_data)
    return form_data

def get_form_data_by_token(db: Session, encrypted_token: str):
    return db.query(models.FormData).filter(models.FormData.encrypted_token == encrypted_token).first()
