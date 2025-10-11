from pydantic import BaseModel, constr


class UserCreate(BaseModel):
    login: str
    password: constr(max_length=72)  # ograniczenie zgodne z bcrypt
    first_name: str
    last_name: str
