from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc, or_
from app.models.project import Project
import uuid
from typing import Sequence, Tuple, Optional

class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_org_id_paginated(
        self, 
        org_id: uuid.UUID,
        page: int = 1,
        limit: int = 10,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None,
        sort: str = "newest"
    ) -> Tuple[Sequence[Project], int]:
        
        query = select(Project).where(Project.organization_id == org_id, Project.is_deleted == False)
        
        # Filtering
        if status:
            query = query.where(Project.status == status)
        if priority:
            query = query.where(Project.priority == priority)
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Project.name.ilike(search_term),
                    Project.key.ilike(search_term)
                )
            )
            
        # Total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()
        
        # Sorting
        if sort == "newest":
            query = query.order_by(desc(Project.created_at))
        elif sort == "oldest":
            query = query.order_by(asc(Project.created_at))
        elif sort == "alphabetical":
            query = query.order_by(asc(Project.name))
        elif sort == "progress":
            query = query.order_by(desc(Project.progress))
        else:
            query = query.order_by(desc(Project.created_at))
            
        # Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        result = await self.db.execute(query)
        items = result.scalars().all()
        
        return items, total

    async def get_recent_projects(self, org_id: uuid.UUID, limit: int = 5) -> Sequence[Project]:
        query = select(Project).where(
            Project.organization_id == org_id, 
            Project.is_deleted == False
        ).order_by(desc(Project.updated_at)).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
        
    async def get_statistics(self, org_id: uuid.UUID) -> dict:
        query = select(Project.status, func.count(Project.id)).where(
            Project.organization_id == org_id, 
            Project.is_deleted == False
        ).group_by(Project.status)
        
        result = await self.db.execute(query)
        stats = {row[0]: row[1] for row in result.all()}
        
        return {
            "total": sum(stats.values()),
            "planning": stats.get("Planning", 0),
            "active": stats.get("Active", 0),
            "completed": stats.get("Completed", 0),
            "on_hold": stats.get("On Hold", 0)
        }
        
    async def get_by_name_and_org(self, name: str, org_id: uuid.UUID) -> Project | None:
        query = select(Project).where(
            Project.name == name,
            Project.organization_id == org_id,
            Project.is_deleted == False
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id(self, project_id: uuid.UUID, org_id: uuid.UUID) -> Project | None:
        result = await self.db.execute(select(Project).where(
            Project.id == project_id, 
            Project.organization_id == org_id,
            Project.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, project: Project) -> Project:
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project
        
    async def update(self, project: Project) -> Project:
        await self.db.commit()
        await self.db.refresh(project)
        return project
        
    async def delete(self, project: Project) -> None:
        project.is_deleted = True
        await self.db.commit()
