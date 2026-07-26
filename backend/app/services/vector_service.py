from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.embedding_repository import EmbeddingRepository
from app.models.embedding import DocumentEmbedding
from typing import List
import uuid
import structlog

logger = structlog.get_logger()

class VectorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.embed_repo = EmbeddingRepository(db)

    async def store_document_vectors(
        self, 
        document_id: uuid.UUID, 
        project_id: uuid.UUID, 
        org_id: uuid.UUID, 
        chunks: List[dict], 
        embeddings: List[List[float]]
    ) -> None:
        """
        Stores chunks and their computed vectors in pgvector.
        """
        if len(chunks) != len(embeddings):
            raise ValueError("Chunks and embeddings length mismatch")
            
        # Optional: delete existing if re-processing
        await self.embed_repo.delete_by_document(document_id)
        
        docs = []
        for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
            docs.append(
                DocumentEmbedding(
                    document_id=document_id,
                    project_id=project_id,
                    organization_id=org_id,
                    chunk_index=chunk['chunk_index'],
                    chunk_text=chunk['text'],
                    metadata_=chunk.get('metadata', {}),
                    embedding=emb
                )
            )
            
        await self.embed_repo.save_batch(docs)
        logger.info("Stored vectors", document_id=str(document_id), chunk_count=len(docs))
