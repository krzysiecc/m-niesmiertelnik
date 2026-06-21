from pydantic import BaseModel, field_validator
from typing import Dict, Any, Optional
from datetime import datetime, date

class UserCreate(BaseModel):
    login: str
    password: str
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None  # Date of birth (optional)

    @field_validator("password")
    @classmethod
    def password_min_length(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value

class UserLogin(BaseModel):
    login: str
    password: str

class UserResponse(BaseModel):
    login: str
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    user_id: str
    is_blocked: bool
    token: Optional[str] = None
    access_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    password: Optional[str] = None

class FormDataCreate(BaseModel):
    data: Dict[str, Any]  # Arbitrary JSON data
    user_id: Optional[str] = None  # Optional user ID

class FormDataResponse(BaseModel):
    encrypted_token: str

class TokenDecryptRequest(BaseModel):
    encrypted_token: str

class TokenDecryptResponse(BaseModel):
    data: Dict[str, Any]
    status: str

class NewIdResponse(BaseModel):
    new_user_id: str
    message: str
