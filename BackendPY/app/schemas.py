from pydantic import BaseModel

# Schemat używany przy rejestracji użytkownika
class UserCreate(BaseModel):
    login: str
    first_name: str
    last_name: str
    password: str  # hasło w czystym tekście, zostanie zhashowane przy zapisie


# Schemat używany przy logowaniu
class UserLogin(BaseModel):
    login: str
    password: str


# Schemat odpowiedzi (bez hasła)
class UserResponse(BaseModel):
    first_name: str
    last_name: str

    class Config:
        from_attributes = True  # dla Pydantic v2
