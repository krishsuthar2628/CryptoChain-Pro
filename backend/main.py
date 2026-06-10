from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas.encrypt_schema import EncryptRequest, EncryptResponse
from .schemas.decrypt_schema import DecryptRequest, DecryptResponse
from .schemas.rsa_schema import RSAResponse
from .core.pipeline_engine import execute_pipeline
from .core.decryption_manager import reverse_pipeline
from .core.metadata_manager import create_metadata, parse_metadata
from .utils.helpers import to_json
from .utils.validators import validate_pipeline, validate_text, validate_keys_if_required
from .algorithms.rsa import RSAAlgorithm

app = FastAPI(title="CryptoChain Pro API")

# Setup CORS to allow frontend to communicate without issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/encrypt", response_model=EncryptResponse)
def encrypt(request: EncryptRequest):
    try:
        validate_text(request.text)
        validate_pipeline(request.pipeline)
        validate_keys_if_required(request.key, request.keys, request.pipeline)

        ciphertext = execute_pipeline(request.text, request.key, request.pipeline, request.keys)
        metadata = create_metadata(request.pipeline, ciphertext)
        
        return EncryptResponse(
            success=True,
            encrypted_data=to_json(metadata),
            metadata=metadata
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/decrypt", response_model=DecryptResponse)
def decrypt(request: DecryptRequest):
    try:
        metadata = parse_metadata(request.encrypted_payload)
        pipeline = metadata["pipeline"]
        ciphertext = metadata["ciphertext"]
        
        validate_keys_if_required(request.key, request.keys, pipeline)
        
        original_text = reverse_pipeline(ciphertext, request.key, pipeline, request.keys)
        
        return DecryptResponse(
            success=True,
            original_text=original_text
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/generate-rsa", response_model=RSAResponse)
def generate_rsa():
    try:
        pub_key, priv_key = RSAAlgorithm.generate_keys()
        return RSAResponse(
            public_key=pub_key,
            private_key=priv_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
