# backend/app/refine.py
import httpx
from typing import Dict, Any, Tuple
from .config import settings

def refine_with_structured_prompt(
    prompt: str,
    structured_prompt: str,
    fibo_json: Dict[str, Any],
    seed: int | None = None,
    api_key: str = None
) -> Tuple[bytes, Dict[str, Any]]:
    """
    Bria FIBO refine workflow:
    1. Use existing structured_prompt (or generate new one)
    2. Generate image with structured_prompt
    """
    from .fibo_client import _render_bria
    
    api_key = api_key or settings.BRIA_API_KEY
    
    # Ensure prompt is not empty (Bria API requirement)
    if not prompt or not prompt.strip():
        prompt = "refined image"
    
    # Add structured_prompt to fibo_json
    fibo_json["structured_prompt"] = structured_prompt
    fibo_json["prompt_text"] = prompt
    
    # Render with structured prompt
    return _render_bria(fibo_json, seed, "512x512", api_key)

def generate_structured_prompt_only(
    prompt: str,
    aspect_ratio: str = "1:1",
    seed: int = 123456,
    api_key: str = None
) -> str:
    """Generate only structured prompt without rendering image"""
    api_key = api_key or settings.BRIA_API_KEY
    
    payload = {
        "prompt": prompt,
        "model_version": "FIBO",
        "negative_prompt": "",
        "aspect_ratio": aspect_ratio,
        "steps_num": 50,
        "guidance_scale": 5,
        "seed": seed
    }
    
    headers = {
        "Content-Type": "application/json",
        "api_token": api_key
    }
    
    response = httpx.post(
        "https://engine.prod.bria-api.com/v2/structured_prompt/generate",
        json=payload,
        headers=headers,
        timeout=10
    )
    
    if response.status_code in (200, 202):
        result = response.json()
        status_url = result.get("status_url")
        
        if status_url:
            from .fibo_client import _poll_bria_status
            final_result = _poll_bria_status(status_url, api_key)
            return final_result.get("result", {}).get("structured_prompt", "")
    
    raise Exception(f"Structured prompt generation failed: {response.text}")
