# backend/app/config.py
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Keys
    REPLICATE_API_TOKEN: str = ""
    FAL_API_KEY: str = ""
    BRIA_API_KEY: str = ""
    RUNWARE_API_KEY: str = ""
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # S3/MinIO
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minio"
    S3_SECRET_KEY: str = "minio123"
    S3_BUCKET: str = "fibo-orchestra"
    S3_REGION: str = "us-east-1"
    USE_S3: bool = False
    
    # CORS
    FRONTEND_ORIGINS: str = "http://localhost:3000"
    
    # Render Provider (replicate, fal, bria, runware)
    RENDER_PROVIDER: str = "replicate"
    
    class Config:
        env_file = ".env"

settings = Settings()
