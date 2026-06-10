from pydantic import BaseModel

class RSAResponse(BaseModel):
    public_key: str
    private_key: str
