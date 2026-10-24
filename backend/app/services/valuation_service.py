import uuid
from datetime import datetime
from ..schemas.valuation import ValuationRequest, ValuationResponse, BOQBreakdown, MaterialQuantity

class ValuationService:
    @classmethod
    def calculate_cost_and_valuation(cls, req: ValuationRequest) -> ValuationResponse:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        estimation_id = f"VAL-{uuid.uuid4().hex[:8].upper()}"

        # Base rate per sqft based on project type and quality
        base_rates = {
            "RESIDENTIAL": {"STANDARD": 185.0, "PREMIUM": 245.0, "LUXURY": 330.0, "ULTRA_LUXURY": 480.0},
            "COMMERCIAL": {"STANDARD": 210.0, "PREMIUM": 290.0, "LUXURY": 395.0, "ULTRA_LUXURY": 560.0},
            "INDUSTRIAL": {"STANDARD": 140.0, "PREMIUM": 195.0, "LUXURY": 275.0, "ULTRA_LUXURY": 390.0},
            "INFRASTRUCTURE": {"STANDARD": 260.0, "PREMIUM": 350.0, "LUXURY": 460.0, "ULTRA_LUXURY": 620.0},
        }

        proj_type = req.project_type.upper() if req.project_type.upper() in base_rates else "RESIDENTIAL"
        quality = req.construction_quality.upper() if req.construction_quality.upper() in base_rates[proj_type] else "PREMIUM"
        base_sqft_cost = base_rates[proj_type][quality]

        # Location multiplier
        location_multipliers = {
            "TIER_1_METRO": 1.35,
            "TIER_2_URBAN": 1.15,
            "TIER_3_SUBURBAN": 0.95,
            "SPECIAL_ECONOMIC_ZONE": 1.22
        }
        loc_mult = location_multipliers.get(req.location_tier.upper(), 1.15)

        # Soil factor
        soil_factors = {
            "NORMAL": 1.0,
            "SOFT_CLAY": 1.08,
            "ROCKY": 1.12,
            "PILING_REQUIRED": 1.20
        }
        soil_mult = soil_factors.get(req.soil_foundation_type.upper(), 1.0)

        # Height multiplier (above 4 floors adds vertical logistics)
        height_mult = 1.0 + (max(0, req.floors_count - 4) * 0.015) + (req.basement_count * 0.05)

        cost_per_sqft = round(base_sqft_cost * loc_mult * soil_mult * height_mult, 2)
        total_construction_cost = round(cost_per_sqft * req.total_built_up_area_sqft, 2)

        # BOQ allocations
        # Civil/Structural: ~38%
        # Finishing: ~22%
        # MEP: ~18%
        # Labor: ~12%
        # Regulatory/Permits: ~4%
        # Contingency: ~6%
        civil_cost = round(total_construction_cost * 0.38, 2)
        finishing_cost = round(total_construction_cost * 0.22, 2)
        mep_cost = round(total_construction_cost * 0.18, 2)
        labor_cost = round(total_construction_cost * 0.12, 2)
        permits_cost = round(total_construction_cost * 0.04, 2)
        contingency_cost = round(total_construction_cost * 0.06, 2)

        # Material quantity heuristics per 1,000 sq ft
        # Approx: 400 bags cement / 1000 sq ft, 3.5 tonnes steel / 1000 sqft, 1200 cu ft sand
        factor = req.total_built_up_area_sqft / 1000.0
        cement_bags = round(factor * 420, 0)
        steel_tonnes = round(factor * 3.8, 1)
        sand_cft = round(factor * 1250, 0)
        aggregate_cft = round(factor * 1850, 0)

        civil_materials = [
            MaterialQuantity(item="OPC 53 Grade Portland Cement", quantity=cement_bags, unit="Bags (50kg)", rate_per_unit=8.5, estimated_cost=round(cement_bags * 8.5, 2)),
            MaterialQuantity(item="Fe 550D TMT Reinforcement Steel", quantity=steel_tonnes, unit="Metric Tonnes", rate_per_unit=820.0, estimated_cost=round(steel_tonnes * 820.0, 2)),
            MaterialQuantity(item="Manufactured River Sand (M-Sand)", quantity=sand_cft, unit="Cubic Feet (CFT)", rate_per_unit=1.8, estimated_cost=round(sand_cft * 1.8, 2)),
            MaterialQuantity(item="Crushed Granite Coarse Aggregate (20mm)", quantity=aggregate_cft, unit="Cubic Feet (CFT)", rate_per_unit=1.4, estimated_cost=round(aggregate_cft * 1.4, 2)),
        ]

        boq = BOQBreakdown(
            civil_structural=civil_cost,
            civil_materials=civil_materials,
            finishing_facade=finishing_cost,
            mep_electrical_plumbing_hvac=mep_cost,
            labor_workforce=labor_cost,
            regulatory_permits_architectural=permits_cost,
            contingency_reserve=contingency_cost
        )

        # Completed market valuation & ROI
        # Market value typically 1.35x to 1.65x of construction cost depending on tier
        tier_markup = {"TIER_1_METRO": 1.62, "TIER_2_URBAN": 1.48, "TIER_3_SUBURBAN": 1.32, "SPECIAL_ECONOMIC_ZONE": 1.55}
        markup = tier_markup.get(req.location_tier.upper(), 1.45)
        market_value = round(total_construction_cost * markup, 2)
        roi_pct = round(((market_value - total_construction_cost) / total_construction_cost) * 100, 1)

        conf_range = {
            "p10_optimistic_cost": round(total_construction_cost * 0.94, 2),
            "p50_expected_cost": total_construction_cost,
            "p90_conservative_cost": round(total_construction_cost * 1.12, 2),
            "confidence_level_pct": 92.0
        }

        verdict = (
            f"AI Real Estate Valuation Assessment: Total capital expenditure estimated at ${total_construction_cost:,.2f} "
            f"(${cost_per_sqft}/sqft). Projected post-completion commercial valuation is ${market_value:,.2f}, delivering an "
            f"attractive ROI of {roi_pct}%. Foundation contingency factored for {req.soil_foundation_type} soil."
        )

        return ValuationResponse(
            estimation_id=estimation_id,
            timestamp=now_str,
            project_type=req.project_type,
            total_built_up_area_sqft=req.total_built_up_area_sqft,
            floors_count=req.floors_count,
            construction_quality=req.construction_quality,
            location_tier=req.location_tier,
            total_estimated_construction_cost=total_construction_cost,
            cost_per_sqft=cost_per_sqft,
            estimated_completed_market_value=market_value,
            projected_roi_percentage=roi_pct,
            regional_cost_multiplier=loc_mult,
            boq=boq,
            budget_confidence_range=conf_range,
            ai_investment_verdict=verdict
        )
