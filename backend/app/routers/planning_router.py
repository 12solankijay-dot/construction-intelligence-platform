from fastapi import APIRouter
from ..schemas.planning import ProjectPlanRequest, ProjectPlanResponse
from ..services.planning_service import PlanningService

router = APIRouter(prefix="/planning", tags=["Project Planning & Scheduling Assistant"])

@router.post("/generate", response_model=ProjectPlanResponse)
async def generate_plan(request: ProjectPlanRequest):
    """
    Generate 6-Phase Work Breakdown Structure (WBS), Gantt milestone schedule, and critical path analysis.
    """
    return PlanningService.generate_project_plan(request)
