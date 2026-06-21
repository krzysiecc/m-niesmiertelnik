from passlib.context import CryptContext
import jwt
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Dict, Any

from .config import settings

# We use Argon2 instead of bcrypt.
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

JWT_ALGORITHM = "HS256"


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_jwt_token(data: Dict[str, Any]) -> str:
    """Create a JWT token wrapping arbitrary form data."""
    payload = {
        "data": data,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),  # Valid for 24h
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=JWT_ALGORITHM)


def decode_jwt_token(token: str) -> Dict[str, Any]:
    """Decode a JWT token and return the wrapped data payload."""
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[JWT_ALGORITHM])
        return payload.get("data", {})
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")


def create_access_token(user_id: str) -> str:
    """Create a signed session access token for the given user id."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "exp": now + timedelta(hours=24),
        "iat": now,
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> str:
    """Decode a session access token and return the subject (user id).

    Raises jwt.PyJWTError subclasses on failure so the caller can convert
    them into a 401 response.
    """
    payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[JWT_ALGORITHM])
    return payload["sub"]


def double_sha256_hash(data: str) -> str:
    """Compute a keyed double SHA256 hash of the given data."""
    # First SHA256 pass.
    first_hash = hashlib.sha256(data.encode()).hexdigest()
    # Second SHA256 pass mixing in the secret key.
    second_hash = hashlib.sha256((first_hash + settings.encryption_key).encode()).hexdigest()
    return second_hash
