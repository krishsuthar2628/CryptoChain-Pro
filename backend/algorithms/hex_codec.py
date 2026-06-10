import binascii

class HexCodec:
    @staticmethod
    def encrypt(text: str, key: str = None) -> str:
        """Encode text to Hexadecimal."""
        return binascii.hexlify(text.encode('utf-8')).decode('utf-8')

    @staticmethod
    def decrypt(encrypted_text: str, key: str = None) -> str:
        """Decode Hexadecimal to text."""
        try:
            return binascii.unhexlify(encrypted_text.encode('utf-8')).decode('utf-8')
        except Exception as e:
            raise ValueError(f"Hex decoding failed: Invalid hex string. {str(e)}")
