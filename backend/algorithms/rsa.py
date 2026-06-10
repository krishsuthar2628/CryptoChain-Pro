import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend

class RSAAlgorithm:
    @staticmethod
    def generate_keys() -> tuple[str, str]:
        """Generate RSA public and private keys."""
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        public_key = private_key.public_key()

        pem_private = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

        pem_public = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        return pem_public.decode('utf-8'), pem_private.decode('utf-8')

    @staticmethod
    def encrypt(text: str, key: str) -> str:
        """Encrypt text using RSA Public Key."""
        try:
            public_key = serialization.load_pem_public_key(
                key.encode('utf-8'),
                backend=default_backend()
            )
            
            ciphertext = public_key.encrypt(
                text.encode('utf-8'),
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            return base64.b64encode(ciphertext).decode('utf-8')
        except Exception as e:
            raise ValueError(f"RSA encryption failed: Invalid public key or data too large. {str(e)}")

    @staticmethod
    def decrypt(encrypted_text: str, key: str) -> str:
        """Decrypt text using RSA Private Key."""
        try:
            private_key = serialization.load_pem_private_key(
                key.encode('utf-8'),
                password=None,
                backend=default_backend()
            )
            
            ciphertext = base64.b64decode(encrypted_text.encode('utf-8'))
            
            plaintext = private_key.decrypt(
                ciphertext,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            return plaintext.decode('utf-8')
        except Exception as e:
            raise ValueError(f"RSA decryption failed: Invalid private key or corrupted data. {str(e)}")
