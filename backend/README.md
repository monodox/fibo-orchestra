# Fibo Orchestra Backend

Production-ready FastAPI backend with real API adapters, Redis queue, and S3/MinIO storage.

## Features

- **Real API Adapters**: Replicate, FAL.ai, and Bria integration
- **Redis Queue**: RQ for background job processing
- **S3/MinIO Storage**: Scalable artifact storage
- **Unit Tests**: Pytest with coverage reporting
- **CI/CD**: GitHub Actions workflow

## Quick Start

### Local Development

1. Install dependencies:
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Unix/Mac
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start Redis (required for production mode):
```bash
docker run -d -p 6379:6379 redis:7
```

4. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

5. Run worker (for Redis queue):
```bash
rq worker --url redis://localhost:6379/0
```



## API Endpoints

- `GET /api/v1/health` - Health check
- `POST /api/v1/translate` - Convert prompt to FIBO JSON
- `POST /api/v1/render-preview` - Generate preview image
- `POST /api/v1/batch-render` - Start batch rendering job
- `GET /api/v1/job-status/{job_id}` - Check batch job status
- `GET /static/*` - Serve generated images and manifests

## Configuration

### Environment Variables

```bash
# API Keys
REPLICATE_API_TOKEN=your_token
FAL_API_KEY=your_key
BRIA_API_KEY=your_key

# Redis
REDIS_URL=redis://localhost:6379/0

# S3/MinIO
USE_S3=true
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_BUCKET=fibo-orchestra

# Provider (replicate, fal, bria)
RENDER_PROVIDER=replicate
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api.py
```

## Production Deployment

### With Docker Compose

```bash
docker-compose up -d
```

### Manual

1. Start Redis
2. Start MinIO (optional)
3. Run API server: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Run workers: `rq worker --url $REDIS_URL`

## Frontend Integration

Set in `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app & endpoints
│   ├── config.py         # Settings management
│   ├── translator.py     # Real API adapters (Replicate/FAL/Bria)
│   ├── fibo_client.py    # Render client with API integration
│   ├── tasks.py          # Background batch processing
│   ├── queue.py          # Redis/RQ queue management
│   ├── storage.py        # S3/MinIO storage abstraction
│   └── schemas/
│       └── fibo_schema.json
├── tests/
│   ├── test_api.py
│   ├── test_translator.py
│   └── test_storage.py
├── requirements.txt
├── pytest.ini
├── worker.py
├── Dockerfile
└── .env.example
```

## Architecture

- **API Layer**: FastAPI with async endpoints
- **Queue**: Redis + RQ for background jobs
- **Storage**: S3/MinIO for artifacts (with local fallback)
- **Adapters**: Pluggable render providers (Replicate, FAL, Bria)
- **Testing**: Pytest with coverage
- **CI/CD**: GitHub Actions
