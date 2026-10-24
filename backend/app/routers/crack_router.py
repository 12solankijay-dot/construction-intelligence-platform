import base64
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, Header
from ..schemas.crack import CrackAnalysisRequest, CrackAnalysisResponse
from ..services.crack_service import CrackService

router = APIRouter(prefix="/crack", tags=["Crack Detection & Defect Analysis"])

@router.post("/analyze", response_model=CrackAnalysisResponse)
async def analyze_crack(
    request: CrackAnalysisRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    """
    Multimodal Structural Crack Detection and Defect Analysis (JSON payload).
    Classifies crack type, measures dimensions, and suggests engineering remediation.
    """
    return CrackService.analyze_structural_crack(request, api_key_override=x_gemini_api_key)

@router.post("/upload-analyze", response_model=CrackAnalysisResponse)
async def upload_and_analyze_crack(
    file: UploadFile = File(...),
    component_type: str = Form("BEAM"),
    structural_age_years: int = Form(3),
    environmental_exposure: str = Form("EXTERIOR_HUMID"),
    site_location_notes: str = Form("Third floor transfer girder"),
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    """
    Multimodal Structural Crack Detection via Direct Image Upload.
    """
    contents = await file.read()
    b64_encoded = base64.b64encode(contents).decode("utf-8")
    mime = file.content_type or "image/jpeg"
    data_uri = f"data:{mime};base64,{b64_encoded}"

    req = CrackAnalysisRequest(
        component_type=component_type,
        structural_age_years=structural_age_years,
        environmental_exposure=environmental_exposure,
        site_location_notes=site_location_notes,
        image_base64=data_uri
    )
    return CrackService.analyze_structural_crack(req, api_key_override=x_gemini_api_key)
