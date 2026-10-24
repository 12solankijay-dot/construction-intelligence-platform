from typing import List, Optional
from pydantic import BaseModel, Field

class CrackAnalysisRequest(BaseModel):
    component_type: str = Field(default="BEAM", description="BEAM, COLUMN, SLAB, FOUNDATION, MASONRY_WALL, RETAINING_WALL")
    structural_age_years: Optional[int] = Field(default=3, description="Estimated age of the structure in years")
    environmental_exposure: Optional[str] = Field(default="EXTERIOR_HUMID", description="INTERIOR_DRY, EXTERIOR_HUMID, MARINE_COASTAL, INDUSTRIAL")
    site_location_notes: Optional[str] = Field(default="Third floor transfer girder", description="Specific site area")
    image_base64: Optional[str] = Field(default=None, description="Base64 encoded defect image")

class CrackAnalysisResponse(BaseModel):
    defect_id: str
    timestamp: str
    component_type: str
    crack_type: str = Field(..., description="STRUCTURAL_SHEAR, FLEXURAL_TENSION, SHRINKAGE_HAIRLINE, SETTLEMENT_SUBSIDENCE, CORROSION_SPALLING")
    severity: str = Field(..., description="MINOR, MODERATE, SEVERE, CRITICAL")
    estimated_width_mm: float = Field(..., description="Estimated maximum surface width in millimeters")
    estimated_length_cm: float = Field(..., description="Estimated surface trace length in centimeters")
    structural_integrity_score: int = Field(..., ge=0, le=100, description="Structural health remaining (0-100)")
    immediate_risk_level: str = Field(..., description="SAFE_TO_MONITOR, REMEDIATION_REQUIRED, URGENT_SHORING_NEEDED, EVACUATION_ALERT")
    probable_causes: List[str]
    recommended_remediation: List[str]
    compliance_assessment: str = Field(..., description="Assessment against ACI 224R / IS 456 acceptable crack limits")
    requires_structural_engineer_signoff: bool
    ai_vision_diagnosis: str
    model_used: str
