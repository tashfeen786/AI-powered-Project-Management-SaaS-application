from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc, or_
from app.models.task import Task
import uuid
from typing import Sequence, Tuple, Optional

class TaskRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project_id_paginated(
        self, 
        project_id: uuid.UUID,
        org_id: uuid.UUID,
        page: int = 1,
        limit: int = 100, # larger limit typical for Kanban
        status: Optional[str] = None,
        priority: Optional[str] = None,
        assignee_id: Optional[uuid.UUID] = None,
        sprint_id: Optional[uuid.UUID] = None,
        search: Optional[str] = None,
        sort: str = "manual"
    ) -> Tuple[Sequence[Task], int]:
        
        query = select(Task).where(
            Task.project_id == project_id, 
            Task.organization_id == org_id,
            Task.is_deleted == False
        )
        
        # Filtering
        if status:
            query = query.where(Task.status == status)
        if priority:
            query = query.where(Task.priority == priority)
        if assignee_id:
            query = query.where(Task.assignee_id == assignee_id)
        if sprint_id:
            query = query.where(Task.sprint_id == sprint_id)
        if search:
            search_term = f"%{search}%"
            query = query.where(Task.title.ilike(search_term))
            
        # Total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()
        
        # Sorting
        if sort == "priority":
            query = query.order_by(asc(Task.priority)) # Might need custom sorting if priority is enum string
        elif sort == "newest":
            query = query.order_by(desc(Task.created_at))
        elif sort == "oldest":
            query = query.order_by(asc(Task.created_at))
        elif sort == "due_date":
            query = query.order_by(asc(Task.due_date))
        else: # manual
            query = query.order_by(asc(Task.order_index), desc(Task.created_at))
            
        # Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)
        
        result = await self.db.execute(query)
        items = result.scalars().all()
        
        return items, total

    async def get_by_id(self, task_id: uuid.UUID, org_id: uuid.UUID) -> Task | None:
        result = await self.db.execute(select(Task).where(
            Task.id == task_id, 
            Task.organization_id == org_id,
            Task.is_deleted == False
        ))
        return result.scalar_one_or_none()
        
    async def create(self, task: Task) -> Task:
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task
        
    async def update(self, task: Task) -> Task:
        await self.db.commit()
        await self.db.refresh(task)
        return task
        
    async def delete(self, task: Task) -> None:
        task.is_deleted = True
        await self.db.commit()
