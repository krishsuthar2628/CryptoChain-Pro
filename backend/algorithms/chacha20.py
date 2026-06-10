import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305
from backend.utils.key_generator import generate_salt, derive_key

class ChaCha20Algorithm:
    @staticmethod
    def encrypt(text: str, key: str) -> str:
        """Encrypt text using ChaCha20-Poly1305."""
        salt = generate_salt(16)
        derived_key = derive_key(key, salt)
        chacha = ChaCha20Poly1305(derived_key)
        
        nonce = os.urandom(12)
        ciphertext = chacha.encrypt(nonce, text.encode('utf-8'), None)
        
        # Payload: salt (16) + nonce (12) + ciphertext
        payload = salt + nonce + ciphertext
        return base64.b64encode(payload).decode('utf-8')

    @staticmethod
    def decrypt(encrypted_text: str, key: str) -> str:
        """Decrypt text using ChaCha20-Poly1305."""
        try:
            payload = base64.b64decode(encrypted_text.encode('utf-8'))
        except Exception as e:
            raise ValueError(f"ChaCha20 decryption failed: invalid base64 payload - {str(e)}")

        if len(payload) < 28:
            raise ValueError("ChaCha20 decryption failed: payload too short")
            
        salt = payload[:16]
        nonce = payload[16:28]
        ciphertext = payload[28:]
        
        derived_key = derive_key(key, salt)
        chacha = ChaCha20Poly1305(derived_key)
        
        try:
            plaintext = chacha.decrypt(nonce, ciphertext, None)
            return plaintext.decode('utf-8')
        except Exception as e:
            raise ValueError("ChaCha20 decryption failed: Incorrect key or corrupted data.")
