from passlib.context import CryptContext

# bcrypt to bezpieczny algorytm haszowania
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Zwraca zahashowane hasło (bcrypt ma limit 72 bajtów, więc obcinamy).
    """
    password = password[:72]
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Sprawdza zgodność hasła z hashem.
    """
    plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)
