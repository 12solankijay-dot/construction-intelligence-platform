import json
import os
import re
import requests
from typing import Optional, Dict, Any
from ..config import settings

class MultimodalAIService:
    """
    Multimodal AI Service supporting Google Gemini Vision models
    with intelligent fallback to high-fidelity civil engineering simulation.
    """

    @classmethod
    def call_gemini_multimodal(
        cls, 
        prompt: str, 
        image_base64: Optional[str] = None, 
        mime_type: str = "image/jpeg",
        api_key_override: Optional[str] = None
    ) -> Optional[str]:
        api_key = api_key_override or settings.GEMINI_API_KEY
        if not api_key:
            return None

        model = settings.GEMINI_MODEL_NAME or "gemini-2.0-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

        parts = []
        if prompt:
            parts.append({"text": prompt})
        
        if image_base64:
            clean_b64 = image_base64
            if "," in clean_b64:
                header, clean_b64 = clean_b64.split(",", 1)
                if "png" in header:
                    mime_type = "image/png"
                elif "webp" in header:
                    mime_type = "image/webp"

            parts.append({
                "inline_data": {
                    "mime_type": mime_type,
                    "data": clean_b64
                }
            })

        payload = {
            "contents": [{"parts": parts}],
            "generationConfig": {
                "temperature": 0.2,
                "response_mime_type": "application/json"
            }
        }

        try:
            resp = requests.post(url, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                candidate_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return candidate_text
            else:
                print(f"[Gemini API Error] Status: {resp.status_code}, Body: {resp.text}")
                return None
        except Exception as e:
            print(f"[Gemini API Exception] {e}")
            return None

    @classmethod
    def parse_json_safely(cls, raw_text: str, fallback_dict: Dict[str, Any]) -> Dict[str, Any]:
        if not raw_text:
            return fallback_dict
        try:
            # Strip markdown fences if present
            cleaned = re.sub(r"^```(json)?\s*", "", raw_text.strip(), flags=re.MULTILINE)
            cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE)
            return json.loads(cleaned)
        except Exception:
            return fallback_dict
