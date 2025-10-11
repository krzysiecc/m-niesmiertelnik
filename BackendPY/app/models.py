from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from .database import Base
from sqlalchemy.orm import Session
from . import models

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    is_lost = Column(Boolean, default=False)

    date_created = Column(DateTime(timezone=True), server_default=func.now())
    date_modified = Column(DateTime(timezone=True), onupdate=func.now())

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
