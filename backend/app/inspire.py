# backend/app/inspire.py
import httpx
import base64
from typing import Dict, Any, Tuple
from io import BytesIO
from PIL import Image
from .config import settings

def inspire_from_image(
    image_bytes: bytes,
    prompt: str = "",
    seed: int | None = None,
    api_key: str = None
) -> Tuple[bytes, Dict[str, Any], str]:
    """
    Bria FIBO Inspire mode:
    1. Extract structured prompt from image
    2. Optionally merge with user prompt
    3. Generate new image
    Returns: (image_bytes, metadata, structured_prompt)
    """
    from .fibo_client import _render_bria
    
    api_key = api_key or settings.BRIA_API_KEY
    
    # Step 1: Extract structured prompt from image
    structured_prompt = _extract_structured_prompt_from_image(image_bytes, prompt, api_key)
    
    # Step 2: Generate image with extracted/merged prompt
    fibo_json = {
        "prompt_text": prompt or "inspired image",
        "structured_prompt": structured_prompt,
        "camera": 45,
        "fov": 35,
        "lighting": "soft_rim",
        "palette": "warm",
        "hdr": False
    }
    
    img_bytes, metadata = _render_bria(fibo_json, seed, "512x512", api_key)
    metadata["structured_prompt"] = structured_prompt
    
    return img_bytes, metadata, structured_prompt

def _extract_structured_prompt_from_image(image_bytes: bytes, user_prompt: str = "", api_key: str = None) -> str:
    """
    Extract structured prompt from image using Bria VLM.
    If user_prompt provided, merge creative intent.
    """
    api_key = api_key or settings.BRIA_API_KEY
    
    # Convert image to base64
    img = Image.open(BytesIO(image_bytes))
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    payload = {
        "image": img_base64,
        "prompt": user_prompt,
        "model_version": "FIBO"
    }
    
    headers = {
        "Content-Type": "application/json",
        "api_token": api_key
    }
    
    # Call image-to-prompt endpoint (if available)
    # Note: This endpoint may need to be confirmed with Bria API docs
    try:
        response = httpx.post(
            "https://engine.prod.bria-api.com/v2/image/to_structured_prompt",
            json=payload,
            headers=headers,
            timeout=30
        )
        
        if response.status_code in (200, 202):
            result = response.json()
            status_url = result.get("status_url")
            
            if status_url:
                from .fibo_client import _poll_bria_status
                final_result = _poll_bria_status(status_url, api_key)
                return final_result.get("result", {}).get("structured_prompt", "")
        
        # Fallback: use structured prompt generation with description
        return _fallback_inspire(user_prompt, api_key)
    
    except Exception as e:
        print(f"Image-to-prompt extraction failed: {e}")
        return _fallback_inspire(user_prompt, api_key)

def _fallback_inspire(prompt: str, api_key: str = None) -> str:
    """Fallback: generate structured prompt from text description"""
    from .translator import _generate_bria_structured_prompt
    
    if not prompt:
        prompt = "artistic image with balanced composition"
    
    try:
        return _generate_bria_structured_prompt(prompt, api_key)
    except:
        return ""
