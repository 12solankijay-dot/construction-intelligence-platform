const API_BASE = "http://localhost:8000/api/v1";

export function getStoredApiKey() {
  return localStorage.getItem("GEMINI_API_KEY") || "";
}

export function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem("GEMINI_API_KEY", key);
  } else {
    localStorage.removeItem("GEMINI_API_KEY");
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const apiKey = getStoredApiKey();

  const headers = {
    ...options.headers,
  };

  if (apiKey) {
    headers["X-Gemini-API-Key"] = apiKey;
  }

  // If body is not FormData, default to application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errJson.detail || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Epic 9: Dashboard
  getDashboardOverview: () => request("/dashboard/overview"),

  // Epic 2: Site Safety
  inspectSafety: (data) => request("/safety/inspect", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  uploadInspectSafety: (formData) => request("/safety/upload-inspect", {
    method: "POST",
    body: formData,
  }),

  // Epic 3: Crack Detection
  analyzeCrack: (data) => request("/crack/analyze", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  uploadAnalyzeCrack: (formData) => request("/crack/upload-analyze", {
    method: "POST",
    body: formData,
  }),

  // Epic 4: Valuation
  estimateValuation: (data) => request("/valuation/estimate", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Epic 5: Planning
  generatePlan: (data) => request("/planning/generate", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Epic 6: Daily Log
  submitDailyLog: (data) => request("/daily-log/submit", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Epic 7: Weather
  getWeatherAdvisory: (data) => request("/weather/advisory", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Epic 8: Knowledge Assistant
  queryKnowledge: (data) => request("/knowledge/query", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};
