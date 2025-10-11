from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import Base, engine, get_db
from app.security import get_password_hash, verify_password

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Serwer działa!"}


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Sprawdź, czy login już istnieje
    existing_user = crud.get_user_by_login(db, user.login)
    if existing_user:
        raise HTTPException(status_code=400, detail="Login already registered")

    hashed_password = get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)


@app.post("/login", response_model=schemas.UserResponse)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_login(db, user.login)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Login or password incorrect")
    return db_user

@app.get("/users/{login}", response_model=schemas.UserResponse)
def read_user(login: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_login(db, login)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
