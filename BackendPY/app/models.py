from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    jwt_id = Column(String, unique=True)   # aktualny JWT dla QR
    czy_nosnik_zgubiony = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
