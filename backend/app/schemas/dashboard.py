from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class DashboardOverviewResponse(BaseModel):
    timestamp: str
    project_name: str
    overall_health_score: int = Field(..., ge=0, le=100)
    safety_compliance_score: int = Field(..., ge=0, le=100)
    structural_integrity_score: int = Field(..., ge=0, le=100)
    schedule_adherence_pct: int = Field(..., ge=0, le=100)
    budget_adherence_pct: int = Field(..., ge=0, le=100)
    active_safety_violations: int
    open_structural_defects: int
    weather_workability_status: str
    total_workers_on_site: int
    recent_inspections: List[dict]
    recent_blockers: List[dict]
    critical_milestones: List[dict]
    executive_summary_bullets: List[str]
