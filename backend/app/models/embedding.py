from sqlalchemy import String, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from app.db.base import BaseModel
import uuid

class DocumentEmbedding(BaseModel):
    __tablename__ = "document_embeddings"

    document_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    
    chunk_index: Mapped[int] = mapped_column(Integer)
    chunk_text: Mapped[str] = mapped_column(Text)
    
    # 384 dimensions for all-MiniLM-L6-v2
    embedding = mapped_column(Vector(384))
    
    metadata_: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    
    document: Mapped["Document"] = relationship()
