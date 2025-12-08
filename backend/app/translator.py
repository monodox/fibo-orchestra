# backend/app/translator.py
import os
import json
import httpx
from typing import Dict, Any
from jsonschema import validate, ValidationError
from .config import settings

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schemas", "fibo_schema.json")
with open(SCHEMA_PATH, "r") as f:
    FIBO_SCHEMA = json.load(f)

def translate_prompt(prompt: str, api_keys: Dict[str, str] = None) -> Dict[str, Any]:
    """
    Translates natural language prompt to FIBO JSON using LLM.
    Supports Replicate, FAL, and Bria APIs.
    """
    api_keys = api_keys or {}
    
    # Use provided API keys or fall back to env
    replicate_key = api_keys.get("replicate") or settings.REPLICATE_API_TOKEN
    fal_key = api_keys.get("fal") or settings.FAL_API_KEY
    bria_key = api_keys.get("bria") or settings.BRIA_API_KEY
    
    provider = settings.RENDER_PROVIDER
    
    # Auto-detect provider based on available API keys
    if provider == "replicate" and not replicate_key:
        if bria_key:
            provider = "bria"
        elif fal_key:
            provider = "fal"
    
    if provider == "replicate" and replicate_key:
        return _translate_replicate(prompt)
    elif provider == "fal" and fal_key:
        return _translate_fal(prompt)
    elif provider == "bria" and bria_key:
        return _translate_bria(prompt)
    else:
        # Try any available key as last resort
        if bria_key:
            return _translate_bria(prompt)
        elif replicate_key:
            return _translate_replicate(prompt)
        elif fal_key:
            return _translate_fal(prompt)
        else:
            # Fallback to heuristic
            return _translate_heuristic(prompt)

def _translate_replicate(prompt: str) -> Dict[str, Any]:
    """Use Replicate API for prompt translation"""
    try:
        import replicate
        # Example: use a text generation model to extract parameters
        output = replicate.run(
            "meta/llama-2-70b-chat",
            input={
                "prompt": f"Extract camera, fov, lighting, palette from: {prompt}. Return JSON.",
                "max_tokens": 200
            }
        )
        # Parse output and merge with defaults
        return _parse_llm_output(output, prompt)
    except Exception:
        return _translate_heuristic(prompt)

def _translate_fal(prompt: str) -> Dict[str, Any]:
    """Use FAL.ai API for prompt translation"""
    try:
        response = httpx.post(
            "https://fal.run/fal-ai/llama-70b",
            headers={"Authorization": f"Key {settings.FAL_API_KEY}"},
            json={"prompt": f"Extract FIBO parameters from: {prompt}"},
            timeout=30
        )
        return _parse_llm_output(response.json(), prompt)
    except Exception:
        return _translate_heuristic(prompt)

def _translate_bria(prompt: str) -> Dict[str, Any]:
    """Use Bria FIBO API for prompt translation with structured prompt"""
    try:
        # Step 1: Generate structured prompt
        structured_prompt = _generate_bria_structured_prompt(prompt)
        
        # Build FIBO JSON with structured prompt
        base = _translate_heuristic(prompt)
        base["structured_prompt"] = structured_prompt
        return base
    except Exception as e:
        print(f"Bria translation failed: {e}")
        return _translate_heuristic(prompt)

def _generate_bria_structured_prompt(prompt: str, api_key: str = None) -> str:
    """Generate structured prompt using Bria API"""
    api_key = api_key or settings.BRIA_API_KEY
    
    payload = {
        "prompt": prompt,
        "model_version": "FIBO",
        "negative_prompt": "",
        "aspect_ratio": "1:1",
        "steps_num": 50,
        "guidance_scale": 5,
        "seed": 123456
    }
    
    headers = {
        "Content-Type": "application/json",
        "api_token": api_key
    }
    
    # Call structured prompt endpoint
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
            # Poll for completion
            final_result = _poll_bria_status_translator(status_url, api_key)
            return final_result.get("result", {}).get("structured_prompt", "")
    
    return ""

def _poll_bria_status_translator(status_url: str, api_token: str, max_attempts: int = 30) -> dict:
    """Poll Bria status URL for structured prompt"""
    import time
    headers = {"api_token": api_token}
    
    for attempt in range(max_attempts):
        response = httpx.get(status_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            status = data.get("status")
            
            if status == "completed":
                return data
            elif status == "failed":
                raise Exception(f"Structured prompt generation failed: {data.get('error')}")
            
            time.sleep(1)
        else:
            raise Exception(f"Status check failed: {response.status_code}")
    
    raise Exception("Structured prompt generation timed out")

def _parse_llm_output(output: Any, prompt: str) -> Dict[str, Any]:
    """Parse LLM output and extract FIBO parameters"""
    # Simple extraction logic - enhance based on actual LLM output format
    base = _translate_heuristic(prompt)
    if isinstance(output, dict):
        base.update({k: v for k, v in output.items() if k in FIBO_SCHEMA["properties"]})
    return base

def _translate_heuristic(prompt: str) -> Dict[str, Any]:
    """Fallback heuristic translator"""
    lower = prompt.lower()
    if "portrait" in lower:
        camera, fov = 50, 35
    elif "product" in lower:
        camera, fov = 35, 45
    else:
        camera, fov = 45, 40
    
    base = {
        "prompt_text": prompt,
        "camera": camera,
        "fov": fov,
        "lighting": "soft_rim",
        "palette": "warm",
        "hdr": False,
        "composition": {"type": "close_up", "rule_of_thirds": True}
    }
    
    try:
        validate(instance=base, schema=FIBO_SCHEMA)
    except ValidationError:
        base = {
            "prompt_text": prompt,
            "camera": 45,
            "fov": 35,
            "lighting": "soft_rim",
            "palette": "neutral",
            "hdr": False,
            "composition": {"type": "centered"}
        }
    return base
