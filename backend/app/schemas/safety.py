from typing import List, Optional
from pydantic import BaseModel, Field

class PPEItem(BaseModel):
    item_name: str = Field(..., description="Name of PPE equipment (e.g., Hardhat, High-Vis Vest)")
    status: str = Field(..., description="Compliant, Non-Compliant, or Not Detected")
    confidence: float = Field(..., ge=0.0, le=1.0, description="AI detection confidence score")
    count_compliant: int = Field(default=0, description="Count of compliant workers/items")
    count_missing: int = Field(default=0, description="Count of missing/violating instances")
    details: str = Field(..., description="Specific observation notes")

class HazardItem(BaseModel):
    hazard_id: str
    category: str = Field(..., description="E.g., Fall Hazard, Electrical, Scaffolding, Housekeeping")
    severity: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    location_in_frame: str = Field(..., description="Approximate visual location in the image")
    description: str = Field(..., description="Detailed description of the danger")
    immediate_action: str = Field(..., description="Required mitigation action")
    osha_reference: Optional[str] = Field(None, description="Relevant OSHA 1926 regulation code")

class SafetyInspectionRequest(BaseModel):
    site_name: str = Field(default="Metro Sky Tower Project")
    zone: str = Field(default="Zone 4 - Scaffolding & Superstructure")
    inspector_name: Optional[str] = Field(default="Safety Officer John Doe")
    image_base64: Optional[str] = Field(default=None, description="Base64 encoded construction image")

class SafetyInspectionResponse(BaseModel):
    inspection_id: str
    timestamp: str
    site_name: str
    zone: str
    inspector_name: str
    overall_safety_score: int = Field(..., ge=0, le=100, description="Composite site safety score (0-100)")
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    person_count_detected: int
    ppe_compliance: List[PPEItem]
    hazards_detected: List[HazardItem]
    corrective_actions: List[str]
    osha_citations: List[str]
    ai_analysis_summary: str
    model_used: str
