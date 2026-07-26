from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.schemas.task import TaskCreate, TaskUpdate, TaskMove, TaskAssign
from app.repositories.task_repository import TaskRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.organization_repository import OrganizationRepository
from app.models.task import Task
from typing import Sequence, Tuple, Optional
import uuid
import time

class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.task_repo = TaskRepository(db)
        self.project_repo = ProjectRepository(db)
        self.org_repo = OrganizationRepository(db)
        
    async def _check_permission(self, user_id: uuid.UUID, org_id: uuid.UUID) -> str:
        role = await self.org_repo.get_user_role(user_id, org_id)
        if not role:
            raise HTTPException(status_code=403, detail="User does not belong to this organization")
        return role.role

    async def get_tasks(
        self, 
        user_id: uuid.UUID,
        org_id: uuid.UUID,
        project_id: uuid.UUID,
        page: int = 1,
        limit: int = 100,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        assignee_id: Optional[uuid.UUID] = None,
        sprint_id: Optional[uuid.UUID] = None,
        search: Optional[str] = None,
        sort: str = "manual"
    ) -> Tuple[Sequence[Task], int]:
        await self._check_permission(user_id, org_id)
        
        project = await self.project_repo.get_by_id(project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        return await self.task_repo.get_by_project_id_paginated(
            project_id, org_id, page, limit, status, priority, assignee_id, sprint_id, search, sort
        )
        
    async def get_task(self, user_id: uuid.UUID, org_id: uuid.UUID, task_id: uuid.UUID) -> Task:
        await self._check_permission(user_id, org_id)
        task = await self.task_repo.get_by_id(task_id, org_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    async def create_task(self, user_id: uuid.UUID, org_id: uuid.UUID, task_in: TaskCreate) -> Task:
        role = await self._check_permission(user_id, org_id)
        if role not in ["owner", "admin", "member"]:
            raise HTTPException(status_code=403, detail="Not enough permissions")
            
        project = await self.project_repo.get_by_id(task_in.project_id, org_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        task = Task(
            title=task_in.title,
            description=task_in.description,
            status=task_in.status,
            priority=task_in.priority,
            story_points=task_in.story_points,
            estimated_hours=task_in.estimated_hours,
            actual_hours=task_in.actual_hours,
            due_date=task_in.due_date,
            labels=task_in.labels,
            sprint_id=task_in.sprint_id,
            project_id=task_in.project_id,
            organization_id=org_id,
            assignee_id=task_in.assignee_id,
            reporter_id=user_id,
            order_index=time.time() # Default append to bottom
        )
        
        created = await self.task_repo.create(task)
        # TODO: Trigger Task Created Activity Hook
        return created

    async def update_task(self, user_id: uuid.UUID, org_id: uuid.UUID, task_id: uuid.UUID, task_in: TaskUpdate) -> Task:
        role = await self._check_permission(user_id, org_id)
        task = await self.get_task(user_id, org_id, task_id)
        
        if role not in ["owner", "admin"] and task.assignee_id != user_id and task.reporter_id != user_id:
            raise HTTPException(status_code=403, detail="Only admins or assignees can update tasks")
        
        update_data = task_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
            
        updated = await self.task_repo.update(task)
        # TODO: Trigger Task Updated Activity Hook
        return updated
        
    async def move_task(self, user_id: uuid.UUID, org_id: uuid.UUID, task_id: uuid.UUID, move_in: TaskMove) -> Task:
        role = await self._check_permission(user_id, org_id)
        task = await self.get_task(user_id, org_id, task_id)
        
        if role not in ["owner", "admin", "member"]:
            raise HTTPException(status_code=403, detail="Not enough permissions")
            
        task.status = move_in.status
        task.order_index = move_in.order_index
        
        updated = await self.task_repo.update(task)
        # Kanban specific optimization: Bulk updates logic typically goes here if needed
        # TODO: Trigger Task Moved Activity Hook
        return updated

    async def assign_task(self, user_id: uuid.UUID, org_id: uuid.UUID, task_id: uuid.UUID, assign_in: TaskAssign) -> Task:
        role = await self._check_permission(user_id, org_id)
        task = await self.get_task(user_id, org_id, task_id)
        
        if role not in ["owner", "admin", "member"]:
            raise HTTPException(status_code=403, detail="Not enough permissions")
            
        task.assignee_id = assign_in.assignee_id
        
        updated = await self.task_repo.update(task)
        # TODO: Trigger Task Assigned Activity Hook
        return updated

    async def delete_task(self, user_id: uuid.UUID, org_id: uuid.UUID, task_id: uuid.UUID) -> None:
        role = await self._check_permission(user_id, org_id)
        task = await self.get_task(user_id, org_id, task_id)
        
        if role not in ["owner", "admin"] and task.reporter_id != user_id:
            raise HTTPException(status_code=403, detail="Only admins or the reporter can delete tasks")
            
        await self.task_repo.delete(task)
        # TODO: Trigger Task Deleted Activity Hook
