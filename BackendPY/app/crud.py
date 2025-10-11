from sqlalchemy.orm import Session
from app import models, auth


def get_user_by_login(db: Session, login: str):
    return db.query(models.User).filter(models.User.login == login).first()


def create_user(db: Session, login: str, password: str, first_name: str, last_name: str):
    hashed = auth.hash_password(password)
    new_user = models.User(
        login=login,
        password=hashed,
        first_name=first_name,
        last_name=last_name,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
