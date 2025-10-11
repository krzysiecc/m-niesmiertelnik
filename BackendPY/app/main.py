from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.database import engine, get_db

app = FastAPI()

# Tworzymy tabele (jeśli jeszcze nie istnieją)
models.Base.metadata.create_all(bind=engine)


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Sprawdź, czy użytkownik o danym loginie już istnieje
    existing_user = crud.get_user_by_login(db, user.login)
    if existing_user:
        raise HTTPException(status_code=400, detail="Login already taken")

    # Utwórz nowego użytkownika
    new_user = crud.create_user(
        db=db,
        login=user.login,
        password=user.password,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    return {"message": "User created successfully", "user_id": new_user.id}
