from passlib.context import CryptContext
import jwt
import hashlib
import json
from datetime import datetime, timedelta
from typing import Dict, Any
import os

# Używamy Argon2 zamiast bcrypt
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Klucz JWT - w produkcji powinien być w zmiennych środowiskowych
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
JWT_ALGORITHM = "HS256"

# Klucz do szyfrowania SHA256 - w produkcji powinien być w zmiennych środowiskowych
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "your-super-secret-encryption-key-change-in-production")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: Dict[str, Any]) -> str:
    """Tworzy JWT token z danych"""
    payload = {
        "data": data,
        "exp": datetime.utcnow() + timedelta(hours=24),  # Token ważny przez 24h
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> Dict[str, Any]:
    """Dekoduje JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload.get("data", {})
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

def double_sha256_encrypt(data: str) -> str:
    """Dwustronne szyfrowanie SHA256"""
    # Pierwszy SHA256
    first_hash = hashlib.sha256(data.encode()).hexdigest()
    # Drugi SHA256 z kluczem
    second_hash = hashlib.sha256((first_hash + ENCRYPTION_KEY).encode()).hexdigest()
    return second_hash

def double_sha256_decrypt(encrypted_data: str, original_token: str) -> bool:
    """Weryfikuje czy zaszyfrowane dane pasują do oryginalnego tokenu"""
    # Sprawdź czy zaszyfrowanie oryginalnego tokenu daje ten sam wynik
    expected_hash = double_sha256_encrypt(original_token)
    return encrypted_data == expected_hash

def generate_qr_data(encrypted_token: str) -> str:
    """Generuje dane do QR kodu - samo zaszyfrowany token"""
    return encrypted_token
