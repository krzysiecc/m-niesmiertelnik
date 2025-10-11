# test_hash.py
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
try:
    h = pwd.hash("verysecurepassword")
    print("Hash OK:", h[:20], "...")
    print("Verify:", pwd.verify("verysecurepassword", h))
except Exception as e:
    print("HASH ERROR:", e)
