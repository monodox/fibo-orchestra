# backend/app/main.py
import os
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any
from uuid import uuid4
import base64

from .config import settings
from .translator import translate_prompt
from .fibo_client import render_from_json
from .tasks import run_batch_render
from .storage import storage
from .refine import refine_with_structured_prompt, generate_structured_prompt_only
from .inspire import inspire_from_image
from .database import db

try:
    from .queue import enqueue_batch_render, get_job_status as get_redis_job_status
    USE_REDIS = True
except:
    USE_REDIS = False

app = FastAPI(title="Fibo Orchestra Backend")

origins = settings.FRONTEND_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# static files (only if not using S3)
if not settings.USE_S3:
    STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
    os.makedirs(STATIC_DIR, exist_ok=True)
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Simple in-memory job store for demo; replace with Redis/DB in prod
JOB_STORE: Dict[str, Dict[str, Any]] = {}

class TranslateRequest(BaseModel):
    prompt: str
    api_keys: Dict[str, str] | None = None

class RenderPreviewRequest(BaseModel):
    fibo_json: Dict[str, Any]
    seed: int | None = None
    size: str | None = "512x512"
    api_keys: Dict[str, str] | None = None

class BatchRequest(BaseModel):
    prompt: str
    sweep: Dict[str, list] | None = None
    project_id: str | None = None

class RefineRequest(BaseModel):
    prompt: str
    structured_prompt: str | None = None
    fibo_json: Dict[str, Any] | None = None
    seed: int | None = None
    api_keys: Dict[str, str] | None = None

class StructuredPromptRequest(BaseModel):
    prompt: str
    aspect_ratio: str | None = "1:1"
    seed: int | None = 123456
    api_keys: Dict[str, str] | None = None

class InspireRequest(BaseModel):
    image_base64: str
    prompt: str | None = ""
    seed: int | None = None
    api_keys: Dict[str, str] | None = None

class CreateProjectRequest(BaseModel):
    name: str
    description: str = ""

@app.get("/api/v1/health")
def health():
    return {"status": "ok"}



@app.get("/api/v1/projects")
def api_get_projects():
    return {"projects": db.get_projects()}

@app.get("/api/v1/projects/{project_id}")
def api_get_project(project_id: str):
    project = db.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

class CreateProjectRequest(BaseModel):
    name: str
    description: str = ""

@app.post("/api/v1/projects")
def api_create_project(req: CreateProjectRequest):
    project = db.create_project(req.name, req.description)
    return project

class UpdateProjectRequest(BaseModel):
    name: str | None = None
    description: str | None = None

@app.put("/api/v1/projects/{project_id}")
def api_update_project(project_id: str, req: UpdateProjectRequest):
    project = db.update_project(project_id, req.name, req.description)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.delete("/api/v1/projects/{project_id}")
def api_delete_project(project_id: str):
    success = db.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True}

@app.get("/api/v1/renders")
def api_get_renders(project_id: str = None):
    return {"renders": db.get_renders(project_id)}

@app.delete("/api/v1/renders/{render_id}")
def api_delete_render(render_id: str):
    success = db.delete_render(render_id)
    if not success:
        raise HTTPException(status_code=404, detail="Render not found")
    return {"success": True}

@app.delete("/api/v1/renders")
def api_clear_all_renders():
    count = db.clear_all_renders()
    return {"success": True, "deleted_count": count}

@app.post("/api/v1/translate")
def api_translate(req: TranslateRequest):
    fibo_json = translate_prompt(req.prompt, api_keys=req.api_keys)
    return {"fibo_json": fibo_json}

@app.post("/api/v1/render-preview")
def api_render_preview(req: RenderPreviewRequest):
    try:
        # Use API keys from request if provided, otherwise use env
        api_keys = req.api_keys or {}
        img_bytes, metadata = render_from_json(req.fibo_json, seed=req.seed, size=req.size, api_keys=api_keys)
        filename = f"preview_{uuid4().hex}.png"
        url = storage.upload(filename, img_bytes, "image/png")
        
        # Save to default project
        db.add_render("default", {
            "image_url": url,
            "fibo_json": req.fibo_json,
            "metadata": metadata
        })
        
        return {"image_url": url, "metadata": metadata}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/batch-render")
def api_batch_render(req: BatchRequest, background_tasks: BackgroundTasks):
    job_id = uuid4().hex
    
    if USE_REDIS:
        # Use Redis queue
        rq_job_id = enqueue_batch_render(job_id, req.dict())
        return {"job_id": rq_job_id}
    else:
        # Fallback to in-memory
        JOB_STORE[job_id] = {"status": "queued", "progress": 0, "result_url": None}
        background_tasks.add_task(run_batch_render, job_id, req.dict(), JOB_STORE)
        return {"job_id": job_id}

@app.get("/api/v1/job-status/{job_id}")
def api_job_status(job_id: str):
    if USE_REDIS:
        return get_redis_job_status(job_id)
    else:
        job = JOB_STORE.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        return job

@app.post("/api/v1/refine")
def api_refine(req: RefineRequest):
    """Refine image generation with structured prompt (Bria FIBO)"""
    try:
        api_keys = req.api_keys or {}
        bria_key = api_keys.get("bria") or settings.BRIA_API_KEY
        
        if not bria_key:
            raise HTTPException(status_code=400, detail="Bria API key required for refine feature")
        
        # Generate structured prompt if not provided
        structured_prompt = req.structured_prompt
        if not structured_prompt:
            structured_prompt = generate_structured_prompt_only(req.prompt, api_key=bria_key)
        
        # Use provided fibo_json or create default
        fibo_json = req.fibo_json or {
            "prompt_text": req.prompt,
            "camera": 45,
            "fov": 35,
            "lighting": "soft_rim",
            "palette": "warm",
            "hdr": False
        }
        
        # Render with structured prompt
        img_bytes, metadata = refine_with_structured_prompt(
            req.prompt,
            structured_prompt,
            fibo_json,
            req.seed,
            api_key=bria_key
        )
        
        filename = f"refined_{uuid4().hex}.png"
        url = storage.upload(filename, img_bytes, "image/png")
        
        return {
            "image_url": url,
            "structured_prompt": structured_prompt,
            "metadata": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/structured-prompt")
def api_structured_prompt(req: StructuredPromptRequest):
    """Generate structured prompt only (Bria FIBO)"""
    try:
        api_keys = req.api_keys or {}
        bria_key = api_keys.get("bria") or settings.BRIA_API_KEY
        
        if not bria_key:
            raise HTTPException(status_code=400, detail="Bria API key required for structured prompt generation")
        
        structured_prompt = generate_structured_prompt_only(
            req.prompt,
            req.aspect_ratio,
            req.seed,
            api_key=bria_key
        )
        
        return {"structured_prompt": structured_prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/inspire")
def api_inspire(req: InspireRequest):
    """Inspire mode: Generate from image with optional prompt (Bria FIBO)"""
    try:
        api_keys = req.api_keys or {}
        bria_key = api_keys.get("bria") or settings.BRIA_API_KEY
        
        if not bria_key:
            raise HTTPException(status_code=400, detail="Bria API key required for inspire feature")
        
        # Decode base64 image
        import base64
        image_bytes = base64.b64decode(req.image_base64)
        
        # Generate inspired image
        img_bytes, metadata, structured_prompt = inspire_from_image(
            image_bytes,
            req.prompt or "",
            req.seed,
            api_key=bria_key
        )
        
        # Upload result
        filename = f"inspired_{uuid4().hex}.png"
        url = storage.upload(filename, img_bytes, "image/png")
        
        return {
            "image_url": url,
            "structured_prompt": structured_prompt,
            "metadata": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
