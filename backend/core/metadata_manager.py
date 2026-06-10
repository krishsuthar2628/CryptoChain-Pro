from ..utils.helpers import get_current_timestamp, from_json

def create_metadata(pipeline: list, ciphertext: str) -> dict:
    """Create the enhanced metadata payload."""
    return {
        "version": "1.0",
        "timestamp": get_current_timestamp(),
        "algorithm_count": len(pipeline),
        "pipeline": pipeline,
        "ciphertext": ciphertext
    }

def parse_metadata(payload: str) -> dict:
    """Parse and validate the JSON metadata payload for decryption."""
    try:
        data = from_json(payload)
    except Exception as e:
        raise ValueError(f"Invalid encrypted payload format. Expected JSON. {str(e)}")
    
    required_fields = ["pipeline", "ciphertext"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field in payload: '{field}'")
            
    return data
