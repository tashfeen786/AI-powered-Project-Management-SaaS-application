from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectStatistics, QuickAction
from app.services.project_service import ProjectService
from app.dependencies.auth import get_current_active_user
from app.models.user import User
from app.utils.response import StandardResponse, success_response, paginated_response

router = APIRouter()

def get_org_id(current_user: User = Depends(get_current_active_user)) -> uuid.UUID:
    if not current_user.current_organization_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No active organization context")
    return current_user.current_organization_id

@router.get("", response_model=StandardResponse)
async def list_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = "newest",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    items, total = await project_service.get_projects(
        user_id=current_user.id,
        org_id=org_id,
        page=page,
        limit=limit,
        status=status,
        priority=priority,
        search=search,
        sort=sort
    )
    
    return paginated_response(
        items=[ProjectResponse.model_validate(p).model_dump() for p in items],
        total=total,
        page=page,
        limit=limit,
        message="Projects retrieved"
    )

@router.get("/recent", response_model=StandardResponse[List[ProjectResponse]])
async def get_recent_projects(
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    projects = await project_service.get_recent_projects(current_user.id, org_id, limit)
    return success_response(
        data=[ProjectResponse.model_validate(p) for p in projects], 
        message="Recent projects retrieved"
    )

@router.get("/statistics", response_model=StandardResponse[ProjectStatistics])
async def get_project_statistics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    stats = await project_service.get_statistics(current_user.id, org_id)
    return success_response(data=stats, message="Statistics retrieved")

@router.get("/quick-actions", response_model=StandardResponse[List[QuickAction]])
async def get_quick_actions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    # This might be dynamic in the future based on user activity. For now, mock it as requested by typical dashboard layouts.
    actions = [
        QuickAction(id="1", title="Create New Project", action="create_project"),
        QuickAction(id="2", title="Review Pending Approvals", action="review_approvals"),
        QuickAction(id="3", title="Generate Weekly Report", action="generate_report"),
    ]
    return success_response(data=actions, message="Quick actions retrieved")

@router.get("/{id}", response_model=StandardResponse[ProjectResponse])
async def get_project(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    project = await project_service.get_project(current_user.id, org_id, id)
    return success_response(data=ProjectResponse.model_validate(project), message="Project retrieved")

@router.post("", response_model=StandardResponse[ProjectResponse])
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    project = await project_service.create_project(current_user.id, org_id, project_in)
    return success_response(
        data=ProjectResponse.model_validate(project), 
        message="Project created"
    )

@router.patch("/{id}", response_model=StandardResponse[ProjectResponse])
async def update_project(
    id: uuid.UUID,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    project = await project_service.update_project(current_user.id, org_id, id, project_in)
    return success_response(data=ProjectResponse.model_validate(project), message="Project updated")

@router.delete("/{id}", response_model=StandardResponse)
async def delete_project(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    project_service = ProjectService(db)
    await project_service.delete_project(current_user.id, org_id, id)
    return success_response(message="Project deleted")

from pydantic import BaseModel
class AnalyzeProjectRequest(BaseModel):
    requirements: str

@router.post("/{id}/analyze", response_model=StandardResponse)
async def analyze_project(
    id: uuid.UUID,
    request: AnalyzeProjectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    org_id: uuid.UUID = Depends(get_org_id)
):
    """
    Phase 1: Direct AI Requirements Analysis.
    Calls Groq LLM to analyze the submitted requirements and returns structured output.
    Persists the analysis as a Requirement record linked to the project.
    """
    import structlog
    import json as json_module
    _logger = structlog.get_logger()

    # 1. Validate project exists
    project_service = ProjectService(db)
    project = await project_service.get_project(current_user.id, org_id, id)

    # 2. Build structured analysis prompt
    analysis_prompt = f"""You are an expert AI Project Architect and Technical Business Analyst.

Analyze the following project requirements and produce a comprehensive, structured analysis.

PROJECT NAME: {project.name}
INDUSTRY: {project.industry or 'Not specified'}
PROJECT TYPE: {project.project_type or 'Not specified'}
TARGET PLATFORM: {project.target_platform or 'Not specified'}
EXPECTED USERS: {project.expected_users or 'Not specified'}
BUDGET: {project.budget or 'Not specified'}
TECH PREFERENCES: {project.tech_preferences or 'Not specified'}

REQUIREMENTS:
{request.requirements}

You MUST return ONLY valid JSON (no markdown, no code fences, no explanatory text before or after).

Return this exact JSON structure:
{{
  "modules": [
    {{
      "name": "Module Name",
      "description": "Brief description",
      "priority": "high|medium|low",
      "estimated_effort_days": 5
    }}
  ],
  "features": [
    {{
      "name": "Feature Name",
      "module": "Parent Module Name",
      "description": "Brief description",
      "priority": "high|medium|low",
      "complexity": "simple|moderate|complex"
    }}
  ],
  "missing_requirements": [
    {{
      "area": "Area name",
      "description": "What is missing and why it matters",
      "severity": "critical|important|nice-to-have"
    }}
  ],
  "ambiguous_requirements": [
    {{
      "requirement": "The ambiguous requirement text",
      "issue": "Why it is ambiguous",
      "suggestion": "How to clarify it"
    }}
  ],
  "suggested_priorities": [
    {{
      "phase": "Phase name (e.g. MVP, Phase 2, Phase 3)",
      "modules": ["Module names in this phase"],
      "rationale": "Why these modules should be in this phase"
    }}
  ],
  "timeline_estimation": {{
    "total_estimated_weeks": 20,
    "phases": [
      {{
        "name": "Phase name",
        "duration_weeks": 6,
        "key_deliverables": ["deliverable1", "deliverable2"]
      }}
    ]
  }},
  "database_entities": [
    {{
      "name": "Entity Name",
      "description": "Brief description",
      "key_fields": ["field1", "field2"],
      "relationships": ["Related to EntityX via foreign key"]
    }}
  ],
  "api_requirements": [
    {{
      "endpoint_group": "Group name (e.g. Authentication, Chat)",
      "endpoints": ["POST /api/auth/login", "GET /api/chats"],
      "description": "Brief description of this API group"
    }}
  ],
  "architecture_recommendations": {{
    "pattern": "Recommended architecture pattern",
    "tech_stack": {{
      "frontend": "Recommended frontend",
      "backend": "Recommended backend",
      "database": "Recommended database",
      "cache": "Recommended cache",
      "ai_ml": "AI/ML components",
      "infrastructure": "Infrastructure recommendations"
    }},
    "key_decisions": ["Decision 1", "Decision 2"],
    "scalability_notes": "Scalability recommendations"
  }},
  "execution_recommendations": [
    {{
      "category": "Category (e.g. Security, Testing, DevOps)",
      "recommendation": "Specific recommendation",
      "priority": "high|medium|low"
    }}
  ]
}}

Be thorough, specific, and base your analysis strictly on the provided requirements.
Identify ALL modules and features explicitly or implicitly mentioned.
Return ONLY the JSON object, nothing else."""

    system_prompt = "You are an expert AI Project Architect. You analyze software requirements and produce structured JSON analysis. Return ONLY valid JSON."

    # 3. Call Groq — with JSON mode enabled so the model is constrained to pure JSON output
    from app.services.groq_service import GroqService
    try:
        result = await GroqService.generate(
            prompt=analysis_prompt,
            system_prompt=system_prompt,
            max_tokens=4096
        )
    except Exception as e:
        _logger.error("AI Requirements Analysis Failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    ai_text = result["text"]
    _logger.info("AI Analysis Completed", tokens=result["tokens"], model=result["model"])

    # 4. Robust JSON extraction — handles pure JSON, markdown fences, and embedded JSON in prose
    import re as _re

    def _extract_json(raw: str) -> dict:
        """Extract the first valid JSON object from raw text using multiple strategies."""
        text = raw.strip()

        # Strategy 1: direct parse (model returned pure JSON)
        try:
            return json_module.loads(text)
        except json_module.JSONDecodeError:
            pass

        # Strategy 2: strip ```json ... ``` or ``` ... ``` fences
        fence_match = _re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
        if fence_match:
            try:
                return json_module.loads(fence_match.group(1).strip())
            except json_module.JSONDecodeError:
                pass

        # Strategy 3: find the outermost { ... } block in the text
        brace_match = _re.search(r"(\{[\s\S]*\})", text)
        if brace_match:
            try:
                return json_module.loads(brace_match.group(1))
            except json_module.JSONDecodeError:
                pass

        raise ValueError("No valid JSON object could be extracted from the AI response")

    try:
        analysis_data = _extract_json(ai_text)
    except (ValueError, Exception) as e:
        _logger.error(
            "Failed to parse AI JSON response",
            error=str(e),
            raw_response_preview=ai_text[:500]
        )
        raise HTTPException(
            status_code=500,
            detail=f"AI returned malformed JSON data: {str(e)}. Please try again."
        )

    # 5. Persist as a Requirement record
    from app.services.requirement_service import RequirementService
    from app.schemas.requirement import GenerateRequirementRequest
    from app.models.requirement import Requirement
    from app.repositories.requirement_repository import RequirementRepository

    req_repo = RequirementRepository(db)
    latest_version = await req_repo.get_latest_version(org_id, id)

    req = Requirement(
        title="AI Requirements Analysis",
        version=latest_version + 1,
        status="Draft",
        confidence_score=0.85,
        generated_content=json_module.dumps(analysis_data, indent=2),
        source_documents=[],
        project_id=id,
        organization_id=org_id,
        created_by_id=current_user.id
    )
    created_req = await req_repo.create(req)

    _logger.info("Requirements Analysis Persisted",
                 requirement_id=str(created_req.id),
                 project_id=str(id))

    return success_response(
        data={
            "requirement_id": str(created_req.id),
            "project_id": str(id),
            "analysis": analysis_data
        },
        message="AI requirements analysis completed"
    )
