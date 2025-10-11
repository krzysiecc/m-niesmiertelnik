from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

SECRET_KEY = "twoj_super_secret_key"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # truncate to 72 characters (bcrypt limit)
    return pwd_context.hash(password[:72])

def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password[:72], hashed_password)

def create_jwt(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(hours=12)
    payload = {"user_id": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
