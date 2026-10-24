import uuid
from typing import Optional
from ..schemas.knowledge import KnowledgeQueryRequest, KnowledgeQueryResponse
from .multimodal_ai import MultimodalAIService

class KnowledgeService:
    @classmethod
    def answer_query(
        cls, 
        req: KnowledgeQueryRequest, 
        api_key_override: Optional[str] = None
    ) -> KnowledgeQueryResponse:
        query_id = f"KNOW-{uuid.uuid4().hex[:8].upper()}"

        # 1. Attempt Gemini LLM response if key is available
        if api_key_override or MultimodalAIService:
            prompt = (
                f"You are the Chief Construction Codes and Standards Compliance Officer. "
                f"A site engineer asks the following question: '{req.query}' in category: '{req.category}'. "
                "Provide a rigorous, professional answer referencing relevant standards such as OSHA 1926, "
                "International Building Code (IBC), ACI 318, ASTM, or NFPA. "
                "Return strict JSON with keys: "
                "detailed_answer (markdown string), "
                "cited_clauses_and_standards (list of strings), "
                "site_compliance_checklist (list of 3-5 strings), "
                "enforcement_risks_and_penalties (string), "
                "related_topics (list of strings)."
            )
            raw_ai = MultimodalAIService.call_gemini_multimodal(
                prompt=prompt,
                api_key_override=api_key_override
            )
            if raw_ai:
                data = MultimodalAIService.parse_json_safely(raw_ai, {})
                if "detailed_answer" in data:
                    return KnowledgeQueryResponse(
                        query_id=query_id,
                        query=req.query,
                        category=req.category,
                        detailed_answer=data.get("detailed_answer", ""),
                        cited_clauses_and_standards=data.get("cited_clauses_and_standards", []),
                        site_compliance_checklist=data.get("site_compliance_checklist", []),
                        enforcement_risks_and_penalties=data.get("enforcement_risks_and_penalties", "OSHA Stop-Work citations applicable."),
                        related_topics=data.get("related_topics", [])
                    )

        # 2. Domain Knowledge Base for standard construction queries
        q_lower = req.query.lower()
        if "scaffold" in q_lower or "fall" in q_lower or "harness" in q_lower:
            ans = (
                "### OSHA 1926 Subpart M & L Compliance: Scaffolding and Fall Protection\n\n"
                "Under OSHA 1926.501, fall protection is mandatory for any employee on a walking/working surface "
                "with an unprotected side or edge that is **6 feet (1.8 m) or more above a lower level**.\n\n"
                "#### Key Requirements:\n"
                "1. **Guardrail Systems:** Top rails must be 42 inches (±3 inches) above the walking level. "
                "Mid-rails must withstand at least 150 lbs of force, and top rails at least 200 lbs.\n"
                "2. **Personal Fall Arrest Systems (PFAS):** Must limit maximum arresting force to 1,800 lbs on a full-body harness. "
                "Lifelines and anchorages must support 5,000 lbs per employee attached.\n"
                "3. **Scaffolding Inspection:** OSHA 1926.451 mandates inspection by a 'Competent Person' prior to each work shift."
            )
            standards = [
                "29 CFR 1926.501 - Duty to Have Fall Protection",
                "29 CFR 1926.502 - Fall Protection Systems Criteria & Practices",
                "29 CFR 1926.451 - General Requirements for Scaffolds"
            ]
            checklist = [
                "Verify scaffolding erected on sound base plates and mudsills.",
                "Ensure full planking with no gaps greater than 1 inch between planks.",
                "Confirm installation of top rail, mid rail, and 4-inch toe-boards on all open sides.",
                "Inspect full-body harnesses, energy-absorbing lanyards, and carabiners for tears or fraying."
            ]
            penalties = "OSHA Willful Violation penalty up to $161,323 per violation with immediate Stop-Work Order."
            related = ["Ladder Safety (1926.1053)", "Excavation Fall Hazards (1926.651)", "Leading Edge Framing Protocols"]

        elif "concrete" in q_lower or "curing" in q_lower or "slump" in q_lower:
            ans = (
                "### Concrete Placement, Slump Testing & Curing Specifications (ACI 301 / ACI 318)\n\n"
                "Fresh concrete quality control is governed by ASTM C143 (Slump Test) and ACI 308 (Curing Standard).\n\n"
                "#### Standards Breakdown:\n"
                "- **Slump Tolerances:** For specified slump of 2 to 4 inches, permissible variation is ±1 inch. "
                "For pumpable mix designs with superplasticizers, target slump is typically 6-8 inches (flow table spread 500-650 mm).\n"
                "- **Hydration & Curing:** Curing must maintain moisture on exposed surfaces for a minimum of **7 days** "
                "(or until 70% compressive strength f'c is achieved).\n"
                "- **Temperature Limits:** Concrete temperature during discharge should be between 10°C (50°F) and 32°C (90°F) per ACI 305R."
            )
            standards = [
                "ACI 308R-16 - Guide to External Curing of Concrete",
                "ASTM C143 / C143M - Standard Test Method for Slump of Hydraulic-Cement Concrete",
                "ASTM C39 - Standard Test Method for Compressive Strength of Cylindrical Concrete Specimens",
                "ACI 318-19 - Building Code Requirements for Structural Concrete"
            ]
            checklist = [
                "Take 3 slump samples per 50 cubic meters of placed concrete.",
                "Cast 6 test cylinders (two for 7-day test, three for 28-day verification, one spare).",
                "Measure temperature of fresh concrete batch at pump hopper before pumping.",
                "Apply liquid membrane-forming curing compound compliant with ASTM C309 within 30 minutes of final finishing."
            ]
            penalties = "Structural non-conformance results in core drill extraction testing and potential demolition at contractor cost."
            related = ["Hot Weather Concreting (ACI 305R)", "Cold Weather Concreting (ACI 306R)", "Crack Control Guidelines (ACI 224R)"]

        else: # General Building Code / OSHA
            ans = (
                f"### Regulatory Overview: {req.query}\n\n"
                "Under the International Building Code (IBC 2024) and OSHA 1926 Safety Regulations, "
                "all active job sites must maintain comprehensive engineering documentation, quality assurance logs, "
                "and personal protective equipment standards.\n\n"
                "Structural design loads must conform to ASCE 7-22 Minimum Design Loads, while on-site mechanical, "
                "electrical, and plumbing installations must adhere to NFPA 70 (National Electrical Code) and the Uniform Plumbing Code."
            )
            standards = [
                "IBC 2024 - Section 1604 General Design Requirements",
                "29 CFR 1926.20 - General Safety and Health Provisions",
                "ASCE 7-22 - Minimum Design Loads and Associated Criteria for Buildings"
            ]
            checklist = [
                "Ensure approved architectural and structural stamped drawings are present at the site office.",
                "Conduct mandatory daily safety briefings with sign-in rosters.",
                "Maintain material test certificates (MTC) for all structural steel and rebar shipments."
            ]
            penalties = "Non-compliance with municipal building codes triggers Notice of Violation and Stop Work Order."
            related = ["Excavation Safety Guidelines", "Fire Life Safety IBC Chapter 9", "Site Electrical Temporary Wiring"]

        return KnowledgeQueryResponse(
            query_id=query_id,
            query=req.query,
            category=req.category,
            detailed_answer=ans,
            cited_clauses_and_standards=standards,
            site_compliance_checklist=checklist,
            enforcement_risks_and_penalties=penalties,
            related_topics=related
        )
