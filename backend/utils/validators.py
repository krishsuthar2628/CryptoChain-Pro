def validate_pipeline(pipeline: list) -> bool:
    """Validate that the pipeline is a non-empty list."""
    if not pipeline or not isinstance(pipeline, list):
        raise ValueError("Pipeline must be a non-empty list of algorithms.")
    return True

def validate_text(text: str) -> bool:
    """Validate that the text is a non-empty string."""
    if not text or not isinstance(text, str):
        raise ValueError("Text payload must be a non-empty string.")
    return True

def validate_keys_if_required(key: str, keys: list, pipeline: list) -> bool:
    """Validate that a key is provided for each algorithm requiring it in the pipeline."""
    for i, algo in enumerate(pipeline):
        algo_upper = algo.upper()
        if algo_upper in ["AES", "CHACHA20", "RSA"]:
            step_key = keys[i] if (keys and i < len(keys)) else key
            if not step_key:
                raise ValueError(f"Key is required for algorithm '{algo}' at step {i+1}.")
    return True
