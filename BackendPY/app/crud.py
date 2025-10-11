# crud.py
from sqlalchemy.orm import Session
from .models import User
from .schemas import UserCreate


from . import models, schemas, security

def create_user(db, user: schemas.UserCreate):
    hashed_pw = security.get_password_hash(user.password)
    db_user = models.User(
        login=user.login,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_pw
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



def get_user_by_login(db: Session, login: str):
    return db.query(User).filter(User.login == login).first()
