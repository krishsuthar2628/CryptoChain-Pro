from .algorithm_registry import get_algorithm

def execute_pipeline(text: str, key: str, pipeline: list, keys: list = None) -> str:
    """Execute encryption algorithms sequentially."""
    current_text = text
    for i, algo_name in enumerate(pipeline):
        algo = get_algorithm(algo_name)
        algo_key = keys[i] if (keys and i < len(keys)) else key
        current_text = algo.encrypt(current_text, algo_key)
    return current_text
