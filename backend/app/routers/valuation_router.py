from fastapi import APIRouter
from ..schemas.valuation import ValuationRequest, ValuationResponse
from ..services.valuation_service import ValuationService

router = APIRouter(prefix="/valuation", tags=["Real Estate Valuation & Cost Estimation"])

@router.post("/estimate", response_model=ValuationResponse)
async def estimate_valuation(request: ValuationRequest):
    """
    Generate Bill of Quantities (BOQ), material estimation, and real estate market valuation.
    """
    return ValuationService.calculate_cost_and_valuation(request)
