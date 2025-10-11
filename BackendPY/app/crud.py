# crud.py
from sqlalchemy.orm import Session
from models import User

def create_user(db: Session, user):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_login(db: Session, login: str):
    return db.query(User).filter(User.login == login).first()
