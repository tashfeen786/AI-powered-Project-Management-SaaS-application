from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from app.db.session import get_db
from app.schemas.jobs import JobCreateRequest, JobResponse
from app.services.job_service import JobService
from app.services.rbac_service import RBACService, Permission
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response
from app.repositories.organization_repository import OrganizationRepository
from fastapi import HTTPException
from app.tasks.document_tasks import process_document_job
from app.tasks.ai_tasks import generate_srs_job, generate_insights_job
from app.tasks.planning_tasks import generate_sprint_plan_job

router = APIRouter()

async def verify_org_and_role(current_user: User, db: AsyncSession, permission: Permission):
    if not current_user.current_organization_id:
        raise HTTPException(status_code=400, detail="No active organization context")
        
    org_repo = OrganizationRepository(db)
    role = await org_repo.get_user_role(current_user.id, current_user.current_organization_id)
    
    if not role or role.status != "accepted":
        raise HTTPException(status_code=403, detail="User is not an active member")
        
    if not RBACService.has_permission(role.role, permission):
        raise HTTPException(status_code=403, detail=f"Missing permission: {permission.value}")
        
    return current_user.current_organization_id

@router.post("", response_model=StandardResponse[JobResponse])
async def create_job(
    request: JobCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    job_service = JobService(db)
    
    job = await job_service.create_job(current_user.id, org_id, request)
    
    # In a real integration, we would dynamically route to the correct Celery task
    # e.g., if request.job_type == "document_parsing":
    #          process_document_job.delay(str(job.id), str(org_id), request.payload.get("doc_id"))
    
    # Marking as queued to mimic immediate handoff to Redis broker
    job.status = "Queued"
    await db.commit()
    
    return success_response(data=JobResponse.model_validate(job), message="Job dispatched to background queue")

@router.get("", response_model=StandardResponse[List[JobResponse]])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    job_service = JobService(db)
    
    jobs = await job_service.get_jobs(org_id)
    return success_response(
        data=[JobResponse.model_validate(j) for j in jobs], 
        message="Background jobs retrieved"
    )

@router.get("/{id}", response_model=StandardResponse[JobResponse])
async def get_job(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.VIEW_PROJECTS)
    job_service = JobService(db)
    
    job = await job_service.get_job(org_id, id)
    return success_response(data=JobResponse.model_validate(job), message="Job details retrieved")

@router.delete("/{id}", response_model=StandardResponse)
async def delete_job(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    org_id = await verify_org_and_role(current_user, db, Permission.EDIT_PROJECTS)
    job_service = JobService(db)
    
    # Ideally we'd invoke Celery's AsyncResult.revoke() here to stop the worker execution
    await job_service.delete_job(org_id, id)
    return success_response(message="Job deleted")
