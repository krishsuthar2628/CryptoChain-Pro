import base64

class Base64Codec:
    @staticmethod
    def encrypt(text: str, key: str = None) -> str:
        """Encode text to Base64."""
        return base64.b64encode(text.encode('utf-8')).decode('utf-8')

    @staticmethod
    def decrypt(encrypted_text: str, key: str = None) -> str:
        """Decode Base64 to text."""
        try:
            return base64.b64decode(encrypted_text.encode('utf-8')).decode('utf-8')
        except Exception as e:
            raise ValueError(f"Base64 decoding failed: Invalid base64 string. {str(e)}")
