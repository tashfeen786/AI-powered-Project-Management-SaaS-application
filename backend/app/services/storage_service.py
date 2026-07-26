import os
import aiofiles
from pathlib import Path
import uuid

# Base upload directory
UPLOAD_DIR = Path("backend/uploads")

class StorageService:
    @staticmethod
    async def save_file(org_id: uuid.UUID, project_id: uuid.UUID, filename: str, content: bytes) -> str:
        """
        Saves a file to local storage. 
        Path structure: backend/uploads/{org_id}/{project_id}/{filename}
        Easily swappable with S3/MinIO implementation later.
        """
        dir_path = UPLOAD_DIR / str(org_id) / str(project_id)
        dir_path.mkdir(parents=True, exist_ok=True)
        
        file_path = dir_path / filename
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
            
        return str(file_path)

    @staticmethod
    async def delete_file(org_id: uuid.UUID, project_id: uuid.UUID, filename: str) -> bool:
        """Deletes a file from local storage."""
        file_path = UPLOAD_DIR / str(org_id) / str(project_id) / filename
        if file_path.exists():
            os.remove(file_path)
            return True
        return False
        
    @staticmethod
    async def read_file(org_id: uuid.UUID, project_id: uuid.UUID, filename: str) -> bytes:
        """Reads a file from local storage into memory."""
        file_path = UPLOAD_DIR / str(org_id) / str(project_id) / filename
        async with aiofiles.open(file_path, 'rb') as f:
            return await f.read()
