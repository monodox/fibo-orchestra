# backend/app/tasks.py
import os
import json
import time
from itertools import product
from typing import Dict, Any
from rq import get_current_job
from .fibo_client import render_from_json
from .storage import storage

def run_batch_render_redis(job_id: str, payload: dict):
    """Redis/RQ version of batch render"""
    job = get_current_job()
    combos = _build_combos(payload)
    manifest = {"prompt": payload.get("prompt", ""), "runs": []}
    total = len(combos)
    
    for i, combo in enumerate(combos):
        job.meta['progress'] = int((i / total) * 100)
        job.save_meta()
        
        fibo_json = {"prompt_text": payload.get("prompt", "")}
        fibo_json.update(combo)
        
        try:
            img_bytes, metadata = render_from_json(fibo_json, seed=None)
            img_key = f"{job_id}/image_{i:04d}.png"
            json_key = f"{job_id}/image_{i:04d}.json"
            
            img_url = storage.upload(img_key, img_bytes, "image/png")
            json_url = storage.upload(json_key, json.dumps(fibo_json, indent=2).encode(), "application/json")
            
            manifest["runs"].append({
                "index": i,
                "json_url": json_url,
                "image_url": img_url,
                "metadata": metadata
            })
        except Exception as e:
            manifest["runs"].append({"index": i, "error": str(e)})
        
        time.sleep(0.2)
    
    manifest_key = f"{job_id}/manifest.json"
    manifest_url = storage.upload(manifest_key, json.dumps(manifest, indent=2).encode(), "application/json")
    
    job.meta['progress'] = 100
    job.save_meta()
    return manifest_url

def run_batch_render(job_id: str, payload: dict, job_store: Dict[str, Any]):
    """Fallback in-memory version for development"""
    combos = _build_combos(payload)
    manifest = {"prompt": payload.get("prompt", ""), "runs": []}
    total = len(combos)
    for i, combo in enumerate(combos):
        job_store[job_id]["status"] = "running"
        job_store[job_id]["progress"] = int((i / total) * 100)
        
        fibo_json = {"prompt_text": payload.get("prompt", "")}
        fibo_json.update(combo)
        
        try:
            img_bytes, metadata = render_from_json(fibo_json, seed=None)
            img_key = f"{job_id}/image_{i:04d}.png"
            json_key = f"{job_id}/image_{i:04d}.json"
            
            img_url = storage.upload(img_key, img_bytes, "image/png")
            json_url = storage.upload(json_key, json.dumps(fibo_json, indent=2).encode(), "application/json")
            
            manifest["runs"].append({
                "index": i,
                "json_url": json_url,
                "image_url": img_url,
                "metadata": metadata
            })
        except Exception as e:
            manifest["runs"].append({"index": i, "error": str(e)})
        
        time.sleep(0.2)
    
    manifest_key = f"{job_id}/manifest.json"
    manifest_url = storage.upload(manifest_key, json.dumps(manifest, indent=2).encode(), "application/json")
    
    job_store[job_id]["status"] = "done"
    job_store[job_id]["progress"] = 100
    job_store[job_id]["result_url"] = manifest_url

def _build_combos(payload: dict) -> list:
    """Build parameter combinations from sweep"""
    sweep = payload.get("sweep") or {}
    if sweep:
        keys = list(sweep.keys())
        lists = [sweep[k] for k in keys]
        combos = []
        for vals in product(*lists):
            combo = {k: vals[i] for i, k in enumerate(keys)}
            combos.append(combo)
        return combos
    return [{}]
