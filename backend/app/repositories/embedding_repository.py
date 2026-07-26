from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.embedding import DocumentEmbedding
import uuid
from typing import Sequence, List

class EmbeddingRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def save_batch(self, embeddings: List[DocumentEmbedding]) -> None:
        """
        Saves a batch of chunks + vector embeddings to the database.
        """
        self.db.add_all(embeddings)
        await self.db.commit()
        
    async def delete_by_document(self, document_id: uuid.UUID) -> None:
        """
        Hard deletes all embeddings associated with a document.
        """
        # Using a simpler delete approach for async
        query = select(DocumentEmbedding).where(DocumentEmbedding.document_id == document_id)
        result = await self.db.execute(query)
        items = result.scalars().all()
        for item in items:
            await self.db.delete(item)
        await self.db.commit()

    async def similarity_search(self, query_embedding: List[float], project_id: uuid.UUID, org_id: uuid.UUID, limit: int = 5) -> Sequence[DocumentEmbedding]:
        """
        Performs Cosine Similarity search using pgvector's <=> operator.
        """
        # DocumentEmbedding.embedding.cosine_distance(query_embedding)
        query = (
            select(DocumentEmbedding)
            .where(
                DocumentEmbedding.project_id == project_id,
                DocumentEmbedding.organization_id == org_id,
                DocumentEmbedding.is_deleted == False
            )
            .order_by(DocumentEmbedding.embedding.cosine_distance(query_embedding))
            .limit(limit)
        )
        
        result = await self.db.execute(query)
        return result.scalars().all()
