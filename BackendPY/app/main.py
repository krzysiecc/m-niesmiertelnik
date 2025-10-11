# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, get_db
import crud, models, schemas


# tworzymy bazę i tabelę
Base.metadata.create_all(bind=engine)

app = FastAPI()


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Serwer działa!"}


@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_login(db, user.login)
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    return crud.create_user(db, user)

@app.get("/users/{login}", response_model=schemas.UserResponse)
def read_user(login: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_login(db, login)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
