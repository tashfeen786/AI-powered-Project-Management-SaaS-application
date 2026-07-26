from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.embedding_repository import EmbeddingRepository
from app.services.embedding_service import EmbeddingService
import uuid
from typing import List, Dict, Any
import structlog

logger = structlog.get_logger()

class RetrievalService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.embed_repo = EmbeddingRepository(db)
        
    async def retrieve_context(self, query: str, project_id: uuid.UUID, org_id: uuid.UUID, limit: int = 5) -> List[Dict[str, Any]]:
        """
        End-to-end RAG retrieval:
        1. Encodes query
        2. Performs cosine similarity search in Postgres
        3. Returns formatted chunk texts and metadata
        """
        logger.info("Retrieving context", query=query, project_id=str(project_id))
        
        # 1. Embed query
        query_embedding = EmbeddingService.generate_embedding(query)
        
        # 2. Search
        results = await self.embed_repo.similarity_search(
            query_embedding=query_embedding,
            project_id=project_id,
            org_id=org_id,
            limit=limit
        )
        
        # 3. Format
        context = []
        for r in results:
            context.append({
                "chunk_id": str(r.id),
                "document_id": str(r.document_id),
                "text": r.chunk_text,
                "metadata": r.metadata_
            })
            
        return context
