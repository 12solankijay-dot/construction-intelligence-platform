from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class MaterialQuantity(BaseModel):
    item: str
    quantity: float
    unit: str
    estimated_cost: float
    rate_per_unit: float

class BOQBreakdown(BaseModel):
    civil_structural: float
    civil_materials: List[MaterialQuantity]
    finishing_facade: float
    mep_electrical_plumbing_hvac: float
    labor_workforce: float
    regulatory_permits_architectural: float
    contingency_reserve: float

class ValuationRequest(BaseModel):
    project_type: str = Field(default="RESIDENTIAL", description="RESIDENTIAL, COMMERCIAL, INDUSTRIAL, INFRASTRUCTURE")
    total_built_up_area_sqft: float = Field(default=25000.0, ge=100.0, description="Total built up area in sq ft")
    floors_count: int = Field(default=5, ge=1, le=100, description="Number of above-ground floors")
    basement_count: int = Field(default=1, ge=0, le=5, description="Number of basement levels")
    construction_quality: str = Field(default="PREMIUM", description="STANDARD, PREMIUM, LUXURY, ULTRA_LUXURY")
    location_tier: str = Field(default="TIER_1_METRO", description="TIER_1_METRO, TIER_2_URBAN, TIER_3_SUBURBAN, SPECIAL_ECONOMIC_ZONE")
    soil_foundation_type: str = Field(default="NORMAL", description="NORMAL, SOFT_CLAY, ROCKY, PILING_REQUIRED")

class ValuationResponse(BaseModel):
    estimation_id: str
    timestamp: str
    project_type: str
    total_built_up_area_sqft: float
    floors_count: int
    construction_quality: str
    location_tier: str
    total_estimated_construction_cost: float
    cost_per_sqft: float
    estimated_completed_market_value: float
    projected_roi_percentage: float
    regional_cost_multiplier: float
    boq: BOQBreakdown
    budget_confidence_range: Dict[str, float]
    ai_investment_verdict: str
