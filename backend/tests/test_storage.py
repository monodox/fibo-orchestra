# tests/test_storage.py
import pytest
from app.storage import StorageClient
from app.config import settings

def test_storage_upload_local():
    settings.USE_S3 = False
    storage = StorageClient()
    
    test_data = b"test image data"
    url = storage.upload("test/image.png", test_data, "image/png")
    
    assert "/static/test/image.png" in url

def test_storage_get_url():
    settings.USE_S3 = False
    storage = StorageClient()
    
    url = storage.get_url("test/file.png")
    assert "/static/test/file.png" in url
