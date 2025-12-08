# backend/app/fibo_client.py
import httpx
import replicate
from typing import Tuple, Dict, Any
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from .config import settings

def render_from_json(fibo_json: Dict[str, Any], seed: int | None = None, size: str = "512x512", api_keys: Dict[str, str] = None) -> Tuple[bytes, Dict[str, Any]]:
    """
    Renders image from FIBO JSON using configured provider.
    Returns: (image_bytes, metadata)
    """
    api_keys = api_keys or {}
    
    # Use provided API keys or fall back to env
    replicate_key = api_keys.get("replicate") or settings.REPLICATE_API_TOKEN
    fal_key = api_keys.get("fal") or settings.FAL_API_KEY
    bria_key = api_keys.get("bria") or settings.BRIA_API_KEY
    runware_key = api_keys.get("runware") or settings.RUNWARE_API_KEY
    
    # Auto-detect provider based on available API keys
    # Priority: bria > replicate > fal > runware (since this is FIBO Orchestra)
    provider = settings.RENDER_PROVIDER
    
    # Override provider if API key is provided and configured provider has no key
    if provider == "replicate" and not replicate_key:
        if bria_key:
            provider = "bria"
        elif fal_key:
            provider = "fal"
        elif runware_key:
            provider = "runware"
    
    if provider == "replicate" and replicate_key:
        return _render_replicate(fibo_json, seed, size, replicate_key)
    elif provider == "fal" and fal_key:
        return _render_fal(fibo_json, seed, size, fal_key)
    elif provider == "bria" and bria_key:
        return _render_bria(fibo_json, seed, size, bria_key)
    elif provider == "runware" and runware_key:
        return _render_runware(fibo_json, seed, size, runware_key)
    else:
        # Try any available key as last resort
        if bria_key:
            return _render_bria(fibo_json, seed, size, bria_key)
        elif replicate_key:
            return _render_replicate(fibo_json, seed, size, replicate_key)
        elif fal_key:
            return _render_fal(fibo_json, seed, size, fal_key)
        elif runware_key:
            return _render_runware(fibo_json, seed, size, runware_key)
        else:
            return _render_placeholder(fibo_json, seed, size)

def _render_replicate(fibo_json: Dict[str, Any], seed: int | None, size: str, api_key: str) -> Tuple[bytes, Dict[str, Any]]:
    """Render using Replicate API"""
    try:
        client = replicate.Client(api_token=api_key)
        output = client.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input={
                "prompt": fibo_json.get("prompt_text", ""),
                "width": int(size.split("x")[0]),
                "height": int(size.split("x")[1]),
                "seed": seed
            }
        )
        # Download image
        response = httpx.get(output[0])
        metadata = {"size": size, "seed": seed, "provider": "replicate"}
        return response.content, metadata
    except Exception as e:
        print(f"Replicate render failed: {e}")
        return _render_placeholder(fibo_json, seed, size)

def _render_fal(fibo_json: Dict[str, Any], seed: int | None, size: str, api_key: str) -> Tuple[bytes, Dict[str, Any]]:
    """Render using FAL.ai API"""
    try:
        w, h = size.split("x")
        response = httpx.post(
            "https://fal.run/fal-ai/fast-sdxl",
            headers={"Authorization": f"Key {api_key}"},
            json={
                "prompt": fibo_json.get("prompt_text", ""),
                "image_size": {"width": int(w), "height": int(h)},
                "seed": seed
            },
            timeout=60
        )
        result = response.json()
        img_url = result["images"][0]["url"]
        img_response = httpx.get(img_url)
        metadata = {"size": size, "seed": seed, "provider": "fal"}
        return img_response.content, metadata
    except Exception as e:
        print(f"FAL render failed: {e}")
        return _render_placeholder(fibo_json, seed, size)

def _render_bria(fibo_json: Dict[str, Any], seed: int | None, size: str, api_key: str) -> Tuple[bytes, Dict[str, Any]]:
    """Render using Bria FIBO API v2 with optional structured prompt"""
    try:
        # Map size to aspect ratio
        aspect_ratio_map = {
            "512x512": "1:1",
            "768x512": "3:2",
            "512x768": "2:3",
            "1024x1024": "1:1",
        }
        aspect_ratio = aspect_ratio_map.get(size, "1:1")
        
        payload = {
            "prompt": fibo_json.get("prompt_text", ""),
            "model_version": "FIBO",
            "negative_prompt": fibo_json.get("negative_prompt", ""),
            "aspect_ratio": aspect_ratio,
            "steps_num": 50,
            "guidance_scale": 5,
            "seed": seed or 123456
        }
        
        # Add structured_prompt if available (for refinement)
        if "structured_prompt" in fibo_json and fibo_json["structured_prompt"]:
            payload["structured_prompt"] = fibo_json["structured_prompt"]
        
        headers = {
            "Content-Type": "application/json",
            "api_token": api_key
        }
        
        # Initial request
        response = httpx.post(
            "https://engine.prod.bria-api.com/v2/image/generate",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code in (200, 202):
            result = response.json()
            status_url = result.get("status_url")
            request_id = result.get("request_id")
            
            if not status_url:
                raise Exception("No status_url returned from Bria API")
            
            # Poll for completion
            final_result = _poll_bria_status(status_url, api_key)
            
            result_data = final_result.get("result", {})
            image_url = result_data.get("image_url")
            structured_prompt = result_data.get("structured_prompt", "")
            used_seed = result_data.get("seed")
            
            # Download image
            img_response = httpx.get(image_url)
            metadata = {
                "size": size,
                "seed": used_seed,
                "provider": "bria",
                "structured_prompt": structured_prompt,
                "request_id": request_id
            }
            return img_response.content, metadata
        
        raise Exception(f"Bria API error: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Bria render failed: {e}")
        return _render_placeholder(fibo_json, seed, size)

def _poll_bria_status(status_url: str, api_token: str, max_attempts: int = 60) -> dict:
    """Poll Bria status URL until completion"""
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
                raise Exception(f"Bria generation failed: {data.get('error')}")
            
            # Still processing, wait and retry
            time.sleep(2)
        else:
            raise Exception(f"Status check failed: {response.status_code}")
    
    raise Exception("Bria generation timed out")

def _render_runware(fibo_json: Dict[str, Any], seed: int | None, size: str, api_key: str) -> Tuple[bytes, Dict[str, Any]]:
    """Render using Runware API"""
    try:
        from runware import Runware, IImageInference
        import asyncio
        
        async def generate():
            runware = Runware(api_key=api_key)
            await runware.connect()
            
            w, h = map(int, size.split("x"))
            
            request = IImageInference(
                positivePrompt=fibo_json.get("prompt_text", ""),
                model="runware:100@1",  # Default Runware model
                width=w,
                height=h,
                numberResults=1,
                seed=seed if seed else None
            )
            
            images = await runware.imageInference(requestImage=request)
            
            if images and len(images) > 0:
                img_url = images[0].imageURL
                response = httpx.get(img_url)
                metadata = {"size": size, "seed": seed, "provider": "runware"}
                return response.content, metadata
            
            raise Exception("No images returned from Runware")
        
        return asyncio.run(generate())
    except Exception as e:
        print(f"Runware render failed: {e}")
        return _render_placeholder(fibo_json, seed, size)

def _render_placeholder(fibo_json: Dict[str, Any], seed: int | None, size: str) -> Tuple[bytes, Dict[str, Any]]:
    """Fallback placeholder renderer"""
    try:
        w, h = map(int, size.split("x"))
    except:
        w, h = 512, 512
    
    img = Image.new("RGB", (w, h), (28, 36, 44))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.load_default()
    except:
        font = None
    
    lines = [
        f"Prompt: {fibo_json.get('prompt_text','')[:60]}",
        f"Camera: {fibo_json.get('camera')}",
        f"FOV: {fibo_json.get('fov')}",
        f"Lighting: {fibo_json.get('lighting')}",
        f"Palette: {fibo_json.get('palette')}",
        f"HDR: {fibo_json.get('hdr')}"
    ]
    y = 12
    for line in lines:
        d.text((12, y), line, fill=(220,220,220), font=font)
        y += 14
    
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    metadata = {"size": f"{w}x{h}", "seed": seed, "provider": "placeholder"}
    return buf.getvalue(), metadata
