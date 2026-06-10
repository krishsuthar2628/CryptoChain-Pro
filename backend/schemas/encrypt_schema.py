from pydantic import BaseModel
from typing import List, Optional

class EncryptRequest(BaseModel):
    text: str
    key: str = ""
    pipeline: List[str]
    keys: Optional[List[str]] = None

class EncryptResponse(BaseModel):
    success: bool
    encrypted_data: str
    metadata: dict
