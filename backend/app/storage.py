# backend/app/storage.py
import os
import boto3
from typing import BinaryIO
from .config import settings

class StorageClient:
    def __init__(self):
        if settings.USE_S3:
            self.s3 = boto3.client(
                's3',
                endpoint_url=settings.S3_ENDPOINT,
                aws_access_key_id=settings.S3_ACCESS_KEY,
                aws_secret_access_key=settings.S3_SECRET_KEY,
                region_name=settings.S3_REGION
            )
            self._ensure_bucket()
        else:
            self.local_dir = os.path.join(os.path.dirname(__file__), "static")
            os.makedirs(self.local_dir, exist_ok=True)
    
    def _ensure_bucket(self):
        try:
            self.s3.head_bucket(Bucket=settings.S3_BUCKET)
        except:
            self.s3.create_bucket(Bucket=settings.S3_BUCKET)
    
    def upload(self, key: str, data: bytes, content_type: str = "application/octet-stream") -> str:
        if settings.USE_S3:
            self.s3.put_object(
                Bucket=settings.S3_BUCKET,
                Key=key,
                Body=data,
                ContentType=content_type
            )
            return f"{settings.S3_ENDPOINT}/{settings.S3_BUCKET}/{key}"
        else:
            path = os.path.join(self.local_dir, key)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "wb") as f:
                f.write(data)
            return f"http://localhost:8000/static/{key}"
    
    def get_url(self, key: str) -> str:
        if settings.USE_S3:
            return f"{settings.S3_ENDPOINT}/{settings.S3_BUCKET}/{key}"
        return f"http://localhost:8000/static/{key}"

storage = StorageClient()
