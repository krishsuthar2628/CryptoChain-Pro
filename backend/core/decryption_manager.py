from .algorithm_registry import get_algorithm

def reverse_pipeline(ciphertext: str, key: str, pipeline: list, keys: list = None) -> str:
    """Reverse encryption algorithms sequentially for decryption.

    The function iterates over the encryption pipeline in reverse order,
    applying each algorithm's ``decrypt`` method. Errors from individual
    codecs (e.g., Base64, Hex, Reverse) are caught and re‑raised with a
    clearer message that includes the step index and algorithm name.
    This aids debugging when a payload is malformed or the wrong key is
    supplied.
    """
    current_text = ciphertext
    for i in reversed(range(len(pipeline))):
        algo_name = pipeline[i]
        algo = get_algorithm(algo_name)
        algo_key = keys[i] if (keys and i < len(keys)) else key
        try:
            current_text = algo.decrypt(current_text, algo_key)
        except Exception as e:
            raise ValueError(f"Decryption failed at step {i+1} ({algo_name}): {str(e)}")
    return current_text
