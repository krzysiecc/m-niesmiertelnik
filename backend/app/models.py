from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime, timedelta, timezone
from .database import Base
import uuid


def _utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(DateTime, nullable=True)  # Date of birth
    user_id = Column(String, unique=True, index=True, nullable=False, default=lambda: str(uuid.uuid4()))  # Unique user ID
    is_blocked = Column(Boolean, default=False, nullable=False)  # Block status
    token = Column(String, nullable=True, default=None)  # User token
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

class OldUserId(Base):
    __tablename__ = "old_user_ids"

    id = Column(Integer, primary_key=True, index=True)
    user_login = Column(String, nullable=False)  # User login
    old_user_id = Column(String, nullable=False)  # Old user ID
    created_at = Column(DateTime, default=_utcnow)
    expires_at = Column(DateTime, default=lambda: _utcnow() + timedelta(seconds=14*24*60*60))  # 14 days

class FormData(Base):
    __tablename__ = "form_data"

    id = Column(Integer, primary_key=True, index=True)
    user_login = Column(String, nullable=False)
    encrypted_token = Column(Text, nullable=False)  # Hashed JWT
    original_data = Column(Text, nullable=False)  # Original JSON data
    created_at = Column(DateTime, default=_utcnow)
