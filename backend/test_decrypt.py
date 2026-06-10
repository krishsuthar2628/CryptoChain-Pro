import sys
import os

# Add project root to sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)

from backend.core.pipeline_engine import execute_pipeline
from backend.core.decryption_manager import reverse_pipeline

# Sample data
text = "Hello World"
pipeline = ['BASE64', 'REVERSE', 'HEX']

# Encrypt using pipeline
enc = execute_pipeline(text, '', pipeline)
print('Encrypted:', enc)

# Decrypt using reverse pipeline
dec = reverse_pipeline(enc, '', pipeline)
print('Decrypted:', dec)
