from pydantic import BaseModel

class UserCreate(BaseModel):
    login: str
    password: str  # już bez max_length=72
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    login: str
    password: str

class UserResponse(BaseModel):
    login: str
    first_name: str
    last_name: str

    class Config:
        orm_mode = True
