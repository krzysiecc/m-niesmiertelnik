# crud.py
from sqlalchemy.orm import Session
from .models import User
from sqlalchemy.orm import Session
from . import models


def create_user(db: Session, user):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_login(db: Session, login: str):
    return db.query(User).filter(User.login == login).first()

def save_token(db: Session, jwe: str, expires_at=None) -> str:
    obj = models.TokenEntry(jwe=jwe, expires_at=expires_at)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj.id

def get_token(db: Session, token_id: str) -> models.TokenEntry | None:
    return db.query(models.TokenEntry).filter(models.TokenEntry.id == token_id).first()

def revoke_token(db: Session, token_id: str) -> bool:
    row = get_token(db, token_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
