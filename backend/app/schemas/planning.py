from typing import List, Optional
from pydantic import BaseModel, Field

class ConstructionPhase(BaseModel):
    phase_id: int
    name: str
    duration_days: int
    start_day: int
    end_day: int
    is_critical_path: bool
    workforce_headcount: int
    key_deliverables: List[str]
    status: str = Field(default="PENDING", description="COMPLETED, IN_PROGRESS, PENDING")
    completion_percentage: int = Field(default=0, ge=0, le=100)
    risk_factors: List[str]

class ProjectPlanRequest(BaseModel):
    project_name: str = Field(default="Grand Horizon Commercial Center")
    project_type: str = Field(default="COMMERCIAL", description="RESIDENTIAL, COMMERCIAL, INDUSTRIAL, HOSPITALITY")
    built_up_area_sqft: float = Field(default=45000.0, ge=500.0)
    floors: int = Field(default=8, ge=1)
    target_duration_months: int = Field(default=18, ge=3, le=60)
    start_date: str = Field(default="2026-11-01")

class ProjectPlanResponse(BaseModel):
    plan_id: str
    timestamp: str
    project_name: str
    project_type: str
    total_duration_days: int
    start_date: str
    projected_completion_date: str
    phases: List[ConstructionPhase]
    critical_path_summary: str
    major_milestones: List[dict]
    recommended_procurement_lead_times: List[dict]
    ai_planning_insights: str
