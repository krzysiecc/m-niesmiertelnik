from typing import Any, Dict, Optional
from datetime import datetime, timedelta, timezone
from pathlib import Path
import json
import jwt  # PyJWT
from jwcrypto import jwk, jwe

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from . import crud, schemas
from .database import Base, engine, get_db

from fastapi import Body

# --- inicjalizacja DB / FastAPI ---
Base.metadata.create_all(bind=engine)
app = FastAPI()


# --- health ---
@app.get("/")
def read_root():
    return {"message": "Serwer działa!"}


# --- rejestracja / użytkownicy ---
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


# ======================
#   OPAQUE HANDLE TOKEN
#   sign (RS256) -> encrypt (JWE) -> store -> return short ID
# ======================

# --- konfiguracja kluczy ---
BASE_DIR = Path(__file__).resolve().parent.parent  # .../BackendPY
PRIVATE_KEY_PATH = BASE_DIR / "keys" / "private.pem"  # do podpisu RS256
PUBLIC_KEY_PATH  = BASE_DIR / "keys" / "public.pem"   # do JWE

_private_key_pem: Optional[str] = None
_public_key_pem: Optional[str] = None

def _get_private_key_pem() -> str:
    global _private_key_pem
    if _private_key_pem is None:
        try:
            _private_key_pem = PRIVATE_KEY_PATH.read_text(encoding="utf-8")
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail="Private key not configured (keys/private.pem missing)")
    return _private_key_pem

def _get_public_key_pem() -> str:
    global _public_key_pem
    if _public_key_pem is None:
        try:
            _public_key_pem = PUBLIC_KEY_PATH.read_text(encoding="utf-8")
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail="Public key not configured (keys/public.pem missing)")
    return _public_key_pem


# --- modele request/response ---
class SignRequest(schemas.BaseModel):  # możesz też użyć Pydantic BaseModel bezpośrednio
    payload: Dict[str, Any]
    kid: Optional[str] = None
    ttl_seconds: Optional[int] = 3600  # czas życia wpisu w magazynie (serwer)

class TokenIdResponse(schemas.BaseModel):
    token_id: str


# --- endpoint: sign (RS256) -> encrypt (JWE) -> zapisz -> zwróć krótkie ID ---
@app.post("/token", response_model=TokenIdResponse)
def sign_encrypt_store(req: SignRequest, db: Session = Depends(get_db)) -> TokenIdResponse:
    # (1) standardowe claimy czasu
    now = datetime.now(timezone.utc)
    payload = dict(req.payload)  # kopia
    payload.setdefault("iat", int(now.timestamp()))
    payload.setdefault("exp", int((now + timedelta(seconds=req.ttl_seconds or 3600)).timestamp()))

    # (2) podpis RS256 (JWS/JWT)
    headers = {}
    if req.kid:
        headers["kid"] = req.kid
    try:
        jwt_compact = jwt.encode(
            payload=payload,
            key=_get_private_key_pem(),
            algorithm="RS256",
            headers=headers
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signing failed: {e}")

    # (3) szyfrowanie JWE (RSA-OAEP-256 + A256GCM)
    try:
        pub_jwk = jwk.JWK.from_pem(_get_public_key_pem().encode("utf-8"))
        jwetoken = jwe.JWE(
            plaintext=jwt_compact.encode("utf-8"),
            protected=json.dumps({
                "alg": "RSA-OAEP-256",
                "enc": "A256GCM",
                "typ": "JWE",
                "cty": "JWT"
            })
        )
        jwetoken.add_recipient(pub_jwk)
        encrypted_compact = jwetoken.serialize(compact=True)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Encryption failed: {e}")

    # (4) zapisz JWE i zwróć krótkie ID
    expires_at = now + timedelta(seconds=req.ttl_seconds or 3600)
    try:
        token_id = crud.save_token(db, encrypted_compact, expires_at=expires_at)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Persist failed: {e}")

    return TokenIdResponse(token_id=token_id)


#TEST

@app.post("/token/resolve")
def resolve_token(token_id: str = Body(..., embed=True), db: Session = Depends(get_db)):
    row = crud.get_token(db, token_id)
    if not row:
        raise HTTPException(status_code=404, detail="Token not found")

    # 1) odszyfruj JWE do wewnętrznego JWT
    priv_jwk = jwk.JWK.from_pem(_get_private_key_pem().encode("utf-8"))
    jwetok = jwe.JWE()
    jwetok.deserialize(row.jwe, key=priv_jwk)
    inner_jwt = jwetok.payload.decode()

    # 2) zweryfikuj podpis i zwróć claims
    claims = jwt.decode(inner_jwt, _get_public_key_pem(), algorithms=["RS256"])
    return {"claims": claims}

