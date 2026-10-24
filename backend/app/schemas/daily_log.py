from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class BlockerItem(BaseModel):
    blocker_id: str
    issue: str
    severity: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    category: str = Field(..., description="MATERIAL_SHORTAGE, WEATHER_DELAY, SUBCONTRACTOR_ABSENCE, INSPECTION_HOLD, EQUIPMENT_BREAKDOWN")
    impact_days: int
    resolution_path: str

class WorkforceHeadcount(BaseModel):
    engineers: int = Field(default=3, ge=0)
    supervisors: int = Field(default=4, ge=0)
    skilled_labor: int = Field(default=28, ge=0)
    unskilled_labor: int = Field(default=45, ge=0)

class DailyLogRequest(BaseModel):
    date: str = Field(default="2026-10-24")
    site_name: str = Field(default="Metro Sky Tower Project")
    supervisor_name: str = Field(default="Site Engineer Marcus Brody")
    weather_condition: str = Field(default="Partly Cloudy, 28°C, Wind 15 km/h")
    workforce: WorkforceHeadcount = Field(default_factory=WorkforceHeadcount)
    active_zones: List[str] = Field(default=["Zone 2 Floor 4 Slab Shuttering", "Zone 1 Basement Waterproofing"])
    equipment_deployed: List[dict] = Field(default=[
        {"equipment": "Tower Crane #1", "hours": 7.5, "status": "Operational"},
        {"equipment": "Concrete Boom Pump", "hours": 4.0, "status": "Maintenance"}
    ])
    field_notes: str = Field(
        default="Completed rebar binding for Grid 4 to 8. Ready for engineer pre-pour inspection. Concrete batching plant delayed truck by 45 mins due to traffic. Minor rain shower around 2 PM halted exterior brickwork for 1 hour. No injuries reported today."
    )

class DailyLogResponse(BaseModel):
    log_id: str
    date: str
    site_name: str
    supervisor_name: str
    weather_condition: str
    total_manpower: int
    productivity_index: str = Field(..., description="HIGH, OPTIMAL, MODERATE, UNDERSTAFFED")
    executive_daily_summary: str
    key_achievements: List[str]
    detected_blockers: List[BlockerItem]
    materials_usage_noted: List[str]
    safety_health_status: str
    tomorrow_priorities: List[str]
    ai_site_sentiment: str = Field(..., description="ON_TRACK, AT_RISK, DELAYED")
