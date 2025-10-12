from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime, timedelta
from .database import Base
import uuid
import hashlib

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(DateTime, nullable=True)  # Data urodzenia
    user_id = Column(String, unique=True, index=True, nullable=False, default=lambda: str(uuid.uuid4()))  # Unikalny ID użytkownika
    is_blocked = Column(Boolean, default=False, nullable=False)  # Status blokady
    token = Column(String, nullable=True, default=None)  # Token użytkownika
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OldUserId(Base):
    __tablename__ = "old_user_ids"
    
    id = Column(Integer, primary_key=True, index=True)
    user_login = Column(String, nullable=False)  # Login użytkownika
    old_user_id = Column(String, nullable=False)  # Stare ID użytkownika
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(seconds=14*24*60*60))  # 14 dni

class FormData(Base):
    __tablename__ = "form_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_login = Column(String, nullable=False)
    encrypted_token = Column(Text, nullable=False)  # Zaszyfrowany JWT
    original_data = Column(Text, nullable=False)  # Oryginalne dane JSON
    created_at = Column(DateTime, default=datetime.utcnow)
