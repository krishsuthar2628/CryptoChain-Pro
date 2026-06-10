import json
from datetime import datetime, timezone

def get_current_timestamp() -> str:
    """Get the current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def to_json(data: dict) -> str:
    """Serialize dict to JSON string."""
    return json.dumps(data)

def from_json(json_str: str) -> dict:
    """Deserialize JSON string to dict."""
    return json.loads(json_str)
