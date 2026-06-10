import sys
import os

# Adjust path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.core.pipeline_engine import execute_pipeline
from backend.core.decryption_manager import reverse_pipeline
from backend.algorithms.rsa import RSAAlgorithm

def test_symmetric_multi_key():
    print("Testing symmetric multi-key pipeline (AES -> REVERSE -> CHACHA20)...")
    text = "Hello, world! Dynamic multi-key test."
    pipeline = ["AES", "REVERSE", "CHACHA20"]
    keys = ["aes-secret-password-123", "", "chacha-secret-password-456"]
    
    # Encrypt
    ciphertext = execute_pipeline(text, key="", pipeline=pipeline, keys=keys)
    print(f"  Ciphertext: {ciphertext[:50]}...")
    
    # Decrypt
    decrypted = reverse_pipeline(ciphertext, key="", pipeline=pipeline, keys=keys)
    print(f"  Decrypted:  {decrypted}")
    
    assert text == decrypted, "Decryption does not match original text!"
    print("  Symmetric multi-key test PASSED!")

def test_asymmetric_multi_key():
    print("\nTesting hybrid asymmetric/symmetric pipeline (RSA -> AES)...")
    text = "Confidential hybrid payload."
    pipeline = ["RSA", "AES"]
    
    # Generate RSA keys
    pub_key, priv_key = RSAAlgorithm.generate_keys()
    
    # Keys for encryption: RSA Public Key, AES Password
    enc_keys = [pub_key, "aes-secret-password"]
    # Keys for decryption: RSA Private Key, AES Password
    dec_keys = [priv_key, "aes-secret-password"]
    
    # Encrypt
    ciphertext = execute_pipeline(text, key="", pipeline=pipeline, keys=enc_keys)
    print(f"  Ciphertext: {ciphertext[:50]}...")
    
    # Decrypt
    decrypted = reverse_pipeline(ciphertext, key="", pipeline=pipeline, keys=dec_keys)
    print(f"  Decrypted:  {decrypted}")
    
    assert text == decrypted, "Decryption does not match original text!"
    print("  Hybrid asymmetric/symmetric test PASSED!")

if __name__ == "__main__":
    try:
        test_symmetric_multi_key()
        test_asymmetric_multi_key()
        print("\nAll backend multi-key tests PASSED successfully!")
    except Exception as e:
        print(f"\nTest failed: {str(e)}")
        sys.exit(1)
