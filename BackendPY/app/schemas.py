from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime, date

class UserCreate(BaseModel):
    login: str
    password: str  # już bez max_length=72
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None  # Data urodzenia (opcjonalna)

class UserLogin(BaseModel):
    login: str
    password: str

class UserResponse(BaseModel):
    login: str
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    user_id: str
    is_blocked: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        schema_extra = {
            "example": {
                "login": "string",
                "first_name": "string",
                "last_name": "string",
                "date_of_birth": "2025-10-12",
                "user_id": "string",
                "is_blocked": False,
                "created_at": "2025-10-12T00:36:37.712Z",
                "updated_at": "2025-10-12T00:36:37.712Z"
            }
        }

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    password: Optional[str] = None

class FormDataCreate(BaseModel):
    data: Dict[str, Any]  # Dowolne dane JSON
    user_id: str = None  # Opcjonalne ID użytkownika

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
