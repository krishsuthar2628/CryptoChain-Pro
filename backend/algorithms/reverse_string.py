class ReverseString:
    @staticmethod
    def encrypt(text: str, key: str = None) -> str:
        """Reverse the string."""
        return text[::-1]

    @staticmethod
    def decrypt(encrypted_text: str, key: str = None) -> str:
        """Reverse the string back to original."""
        return encrypted_text[::-1]
