from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, UploadFile
from app.repositories.document_repository import DocumentRepository
from app.repositories.project_repository import ProjectRepository
from app.services.storage_service import StorageService
from app.services.parser_service import ParserService
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.models.document import Document
from app.utils.file_utils import compute_checksum
import uuid
import structlog
from typing import Sequence, Tuple
from app.services.activity_service import ActivityService

logger = structlog.get_logger()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md", ".png", ".jpg", ".jpeg", ".gif", ".webp"}
MAX_FILE_SIZE = 15 * 1024 * 1024 # 15 MB

class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.doc_repo = DocumentRepository(db)
        self.project_repo = ProjectRepository(db)
        
    async def upload_document(self, user_id: uuid.UUID, org_id: uuid.UUID, project_id: uuid.UUID, file: UploadFile, folder_path: str = "root") -> Document:
        # Validate Project
        project = await self.project_repo.get_by_id(project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        # Validate Extension
        ext = f".{file.filename.split('.')[-1].lower()}" if "." in file.filename else ""
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")
            
        # Read file safely
        file_bytes = await file.read()
        file_size = len(file_bytes)
        
        # Validate Size
        if file_size == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File exceeds maximum size of 15MB")
            
        checksum = compute_checksum(file_bytes)
        
        # Check Duplicate Checksum in Project
        duplicate = await self.doc_repo.get_by_checksum_in_project(checksum, project_id)
        if duplicate:
            raise HTTPException(status_code=409, detail="This exact file has already been uploaded to this project")
            
        # Secure filename generation
        secure_filename = f"{uuid.uuid4()}{ext}"
        
        # Store file
        await StorageService.save_file(org_id, project_id, secure_filename, file_bytes)
        
        # Persist Metadata
        doc = Document(
            filename=secure_filename,
            original_filename=file.filename,
            extension=ext,
            mime_type=file.content_type or "application/octet-stream",
            file_size=file_size,
            checksum=checksum,
            processing_status="Uploaded",
            project_id=project_id,
            organization_id=org_id,
            uploaded_by_id=user_id,
            folder_path=folder_path
        )
        
        created = await self.doc_repo.create(doc)
        logger.info("Document Uploaded", doc_id=str(created.id), project_id=str(project_id))
        
        act_service = ActivityService(self.db)
        await act_service.log_activity(
            project_id=project_id,
            actor_id=user_id,
            type="document_uploaded",
            description=f"Uploaded document '{file.filename}'",
            org_id=org_id
        )
        
        # Queue Processing immediately
        await self.process_document(created.id, org_id, file_bytes)
        
        return created

    async def process_document(self, doc_id: uuid.UUID, org_id: uuid.UUID, content: bytes = None):
        """
        Processes document extraction.
        Future architecture note: This should be handed off to Celery or an async worker queue.
        Keeping inline for current architecture scope.
        """
        doc = await self.doc_repo.get_by_id(doc_id, org_id)
        if not doc:
            return
            
        doc.processing_status = "Processing"
        await self.doc_repo.update(doc)
        logger.info("Processing Started", doc_id=str(doc.id))
        
        try:
            if not content:
                content = await StorageService.read_file(org_id, doc.project_id, doc.filename)
                
            parsed_text = ""
            if doc.extension == ".pdf":
                parsed_text = await ParserService.parse_pdf(content)
            elif doc.extension == ".docx":
                parsed_text = await ParserService.parse_docx(content)
            elif doc.extension in [".txt", ".md"]:
                parsed_text = await ParserService.parse_markdown(content)
                
            # AI Pipeline Integration
            if parsed_text:
                # 1. Chunking
                chunks = ChunkingService.chunk_text(
                    text=parsed_text, 
                    metadata={"filename": doc.filename, "original_filename": doc.original_filename}
                )
                chunk_dicts = [{"chunk_index": c.chunk_index, "text": c.text, "metadata": c.metadata} for c in chunks]
                
                # 2. Embeddings
                texts = [c["text"] for c in chunk_dicts]
                embeddings = EmbeddingService.generate_embeddings_batch(texts)
                
                # 3. Vector Database Storage
                vector_service = VectorService(self.db)
                await vector_service.store_document_vectors(
                    document_id=doc.id,
                    project_id=doc.project_id,
                    org_id=org_id,
                    chunks=chunk_dicts,
                    embeddings=embeddings
                )
            
            doc.processing_status = "Processed"
            doc.parser_version = ParserService.VERSION
            await self.doc_repo.update(doc)
            logger.info("Processing Completed", doc_id=str(doc.id), text_length=len(parsed_text))
            
        except Exception as e:
            logger.error("Processing Failed", doc_id=str(doc.id), error=str(e))
            doc.processing_status = "Failed"
            await self.doc_repo.update(doc)

    async def list_documents(self, org_id: uuid.UUID, project_id: uuid.UUID, page: int = 1, limit: int = 20, search: str = None) -> Tuple[Sequence[Document], int]:
        return await self.doc_repo.get_by_project_paginated(org_id, project_id, page, limit, search)

    async def get_document(self, org_id: uuid.UUID, doc_id: uuid.UUID) -> Document:
        doc = await self.doc_repo.get_by_id(doc_id, org_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        return doc

    async def delete_document(self, org_id: uuid.UUID, doc_id: uuid.UUID) -> None:
        doc = await self.get_document(org_id, doc_id)
        await self.doc_repo.delete(doc)
        await StorageService.delete_file(org_id, doc.project_id, doc.filename)
        logger.info("Document Deleted", doc_id=str(doc.id))
        
    async def update_document(self, org_id: uuid.UUID, doc_id: uuid.UUID, new_name: str = None, new_folder: str = None) -> Document:
        doc = await self.get_document(org_id, doc_id)
        
        if new_name is not None:
            if not new_name.strip():
                raise HTTPException(status_code=400, detail="Filename cannot be empty")
            if not new_name.endswith(doc.extension):
                new_name += doc.extension
            doc.original_filename = new_name
            
        if new_folder is not None:
            doc.folder_path = new_folder
            
        updated = await self.doc_repo.update(doc)
        logger.info("Document Updated", doc_id=str(doc.id), new_name=new_name, new_folder=new_folder)
        return updated
