"""Seed the database with example users so the app works end-to-end locally.

Run from the BackendPY directory (with a .env in place) as:

    python -m app.seed

Each seeded user gets a working login, a medical profile, and a stored
emergency token, so you can log in and immediately see the dashboard, QR code
and the public /mobile/scan page. Re-running the script resets the example
users (it is idempotent).
"""

import json
from datetime import date

from .database import Base, engine, SessionLocal
from . import crud, schemas
from .security import get_password_hash, create_jwt_token, double_sha256_hash


# Example accounts. All passwords are the same to keep local testing simple.
DEFAULT_PASSWORD = "haslo1234"

USERS = [
    {
        "login": "jan.kowalski@example.com",
        "first_name": "Jan",
        "last_name": "Kowalski",
        "dob": date(1985, 6, 15),
        "medical": {
            "name": "Jan Kowalski",
            "gender": "M",
            "bloodType": "A Rh+",
            "birthdate": "15.06.1985",
            "chronicDiseases": ["Cukrzyca typu 1", "Nadciśnienie"],
            "allergies": ["Penicylina", "Orzeszki ziemne"],
            "permanentMedications": ["Insulina", "Ramipril"],
            "trustedContacts": [
                {"fullName": "Anna Kowalska", "phone": "+48 600 100 200"},
            ],
        },
    },
    {
        "login": "anna.nowak@example.com",
        "first_name": "Anna",
        "last_name": "Nowak",
        "dob": date(1992, 11, 22),
        "medical": {
            "name": "Anna Nowak",
            "gender": "F",
            "bloodType": "0 Rh-",
            "birthdate": "22.11.1992",
            "chronicDiseases": ["Astma"],
            "allergies": ["Pyłki traw", "Sierść kota"],
            "permanentMedications": ["Salbutamol"],
            "trustedContacts": [
                {"fullName": "Piotr Nowak", "phone": "+48 601 300 400"},
            ],
        },
    },
    {
        "login": "marek@example.com",
        "first_name": "Marek",
        "last_name": "Wiśniewski",
        "dob": date(1978, 3, 3),
        "medical": {
            "name": "Marek Wiśniewski",
            "gender": "M",
            "bloodType": "B Rh+",
            "birthdate": "03.03.1978",
            "chronicDiseases": [],
            "allergies": ["Lateks"],
            "permanentMedications": [],
            "trustedContacts": [
                {"fullName": "Ewa Wiśniewska", "phone": "+48 602 500 600"},
            ],
        },
    },
]


def seed_user(db, entry: dict):
    """Create (or reset) a single example user with a working emergency token."""
    login = entry["login"]

    # Idempotent: remove any existing copy first.
    if crud.get_user_by_login(db, login):
        crud.delete_user(db, login)

    user = crud.create_user(
        db,
        schemas.UserCreate(
            login=login,
            password=DEFAULT_PASSWORD,
            first_name=entry["first_name"],
            last_name=entry["last_name"],
            date_of_birth=entry["dob"],
        ),
        get_password_hash(DEFAULT_PASSWORD),
    )

    # Build the emergency data blob and store it the same way /generateToken does.
    data = {"userId": user.user_id, "is_blocked": False, **entry["medical"]}
    encrypted_token = double_sha256_hash(create_jwt_token(data))
    crud.create_form_data(db, login, encrypted_token, json.dumps(data, ensure_ascii=False))
    user.token = encrypted_token
    db.commit()
    return user


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for entry in USERS:
            seed_user(db, entry)
    finally:
        db.close()

    print(f"Seeded {len(USERS)} example users (password for all: {DEFAULT_PASSWORD}):")
    for entry in USERS:
        print(f"  - {entry['login']}")


if __name__ == "__main__":
    seed()
