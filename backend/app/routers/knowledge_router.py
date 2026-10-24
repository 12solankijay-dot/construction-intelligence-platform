from typing import Optional
from fastapi import APIRouter, Header
from ..schemas.knowledge import KnowledgeQueryRequest, KnowledgeQueryResponse
from ..services.knowledge_service import KnowledgeService

router = APIRouter(prefix="/knowledge", tags=["Construction Knowledge Assistant"])

@router.post("/query", response_model=KnowledgeQueryResponse)
async def query_construction_knowledge(
    request: KnowledgeQueryRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    """
    AI Construction Code & Standards Assistant (OSHA 1926, IBC 2024, ACI 318, ASTM).
    """
    return KnowledgeService.answer_query(request, api_key_override=x_gemini_api_key)
