from typing import List, Optional
from pydantic import BaseModel, Field

class KnowledgeQueryRequest(BaseModel):
    query: str = Field(..., min_length=3, description="User question on building codes, safety regulations, or standards")
    category: str = Field(default="OSHA_SAFETY", description="OSHA_SAFETY, BUILDING_CODE_IBC, STRUCTURAL_ACI_IS, SUSTAINABILITY_LEED, QUALITY_ASTM")

class KnowledgeQueryResponse(BaseModel):
    query_id: str
    query: str
    category: str
    detailed_answer: str
    cited_clauses_and_standards: List[str]
    site_compliance_checklist: List[str]
    enforcement_risks_and_penalties: str
    related_topics: List[str]
