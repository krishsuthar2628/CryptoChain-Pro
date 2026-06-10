# CryptoChain Pro

Advanced multi-layer encryption and decryption studio.

## Features
- Dynamic Pipeline Builder (AES-256, ChaCha20, RSA, Base64, Hex, Reverse)
- RSA Key Management
- Local History tracking
- TXT / JSON Export

## Running the Application

### 1. Start the Backend
Requires Python 3.9+
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Run the Frontend
You can serve the frontend directory with any static file server.
```bash
cd frontend
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.
