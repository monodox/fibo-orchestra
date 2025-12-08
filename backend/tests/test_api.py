# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_translate():
    response = client.post(
        "/api/v1/translate",
        json={"prompt": "cinematic portrait"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "fibo_json" in data
    assert data["fibo_json"]["prompt_text"] == "cinematic portrait"
    assert "camera" in data["fibo_json"]
    assert "fov" in data["fibo_json"]

def test_render_preview():
    response = client.post(
        "/api/v1/render-preview",
        json={
            "fibo_json": {
                "prompt_text": "test",
                "camera": 45,
                "fov": 35,
                "lighting": "soft",
                "palette": "warm",
                "hdr": False
            }
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "image_url" in data
    assert "metadata" in data

def test_batch_render():
    response = client.post(
        "/api/v1/batch-render",
        json={
            "prompt": "product shot",
            "sweep": {"camera": [30, 45], "fov": [35]}
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data

def test_job_status():
    # First create a job
    batch_response = client.post(
        "/api/v1/batch-render",
        json={"prompt": "test"}
    )
    job_id = batch_response.json()["job_id"]
    
    # Check status
    response = client.get(f"/api/v1/job-status/{job_id}")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
