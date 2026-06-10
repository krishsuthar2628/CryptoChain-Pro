from ..algorithms.aes import AESAlgorithm
from ..algorithms.chacha20 import ChaCha20Algorithm
from ..algorithms.rsa import RSAAlgorithm
from ..algorithms.base64_codec import Base64Codec
from ..algorithms.hex_codec import HexCodec
from ..algorithms.reverse_string import ReverseString

ALGORITHM_REGISTRY = {
    "AES": AESAlgorithm,
    "CHACHA20": ChaCha20Algorithm,
    "RSA": RSAAlgorithm,
    "BASE64": Base64Codec,
    "HEX": HexCodec,
    "REVERSE": ReverseString
}

def get_algorithm(name: str):
    algo = ALGORITHM_REGISTRY.get(name.upper())
    if not algo:
        raise ValueError(f"Algorithm '{name}' is not supported.")
    return algo
