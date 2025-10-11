# schemas.py
from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    login: str
    first_name: str
    last_name: str
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None

class UserResponse(BaseModel):
    first_name: str
    last_name: str
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None

    class Config:
        from_attributes = True  # Pydantic v2
