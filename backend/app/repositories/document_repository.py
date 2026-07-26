from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.document import Document
import uuid
from typing import Sequence, Tuple, Optional

class DocumentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project_paginated(
        self, 
        org_id: uuid.UUID,
        project_id: uuid.UUID,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None
    ) -> Tuple[Sequence[Document], int]:
        
        query = select(Document).where(
            Document.project_id == project_id, 
            Document.organization_id == org_id,
            Document.is_deleted == False
        )
        
        if search:
            query = query.where(Document.filename.ilike(f"%{search}%"))
            
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar_one()
        
        query = query.order_by(desc(Document.created_at))
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        items = (await self.db.execute(query)).scalars().all()
        return items, total

    async def get_by_id(self, doc_id: uuid.UUID, org_id: uuid.UUID) -> Document | None:
        result = await self.db.execute(select(Document).where(
            Document.id == doc_id, 
            Document.organization_id == org_id,
            Document.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def get_by_checksum_in_project(self, checksum: str, project_id: uuid.UUID) -> Document | None:
        result = await self.db.execute(select(Document).where(
            Document.checksum == checksum,
            Document.project_id == project_id,
            Document.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, document: Document) -> Document:
        self.db.add(document)
        await self.db.commit()
        await self.db.refresh(document)
        return document
        
    async def update(self, document: Document) -> Document:
        await self.db.commit()
        await self.db.refresh(document)
        return document
        
    async def delete(self, document: Document) -> None:
        document.is_deleted = True
        await self.db.commit()
