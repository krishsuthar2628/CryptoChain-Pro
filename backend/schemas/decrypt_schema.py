from pydantic import BaseModel
from typing import List, Optional

class DecryptRequest(BaseModel):
    encrypted_payload: str
    key: str = ""
    keys: Optional[List[str]] = None

class DecryptResponse(BaseModel):
    success: bool
    original_text: str
