import os
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend

def generate_salt(length: int = 16) -> bytes:
    """Generate a secure random salt."""
    return os.urandom(length)

def derive_key(password: str, salt: bytes) -> bytes:
    """
    Derive a 32-byte secure key from a password using PBKDF2.
    """
    if not password:
        raise ValueError("Password cannot be empty.")
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
        backend=default_backend()
    )
    return kdf.derive(password.encode('utf-8'))

def encode_salt(salt: bytes) -> str:
    """Encode salt to Base64 string for storage/transmission."""
    return base64.b64encode(salt).decode('utf-8')

def decode_salt(salt_str: str) -> bytes:
    """Decode salt from Base64 string."""
    return base64.b64decode(salt_str.encode('utf-8'))
