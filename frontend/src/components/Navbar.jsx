import React from 'react';
import { HardHat, Settings, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { getStoredApiKey } from '../api/client';

export default function Navbar({ onOpenSettings, activeView }) {
  const hasCustomKey = Boolean(getStoredApiKey());

  const viewTitles = {
    dashboard: "Executive Intelligence Dashboard",
    safety: "Site Safety & PPE Multimodal Inspector",
    crack: "Structural Crack & Defect Assessment",
    valuation: "BOQ Cost Estimation & Property Valuation",
    planning: "Project Planning & WBS Milestone Scheduler",
    daily_log: "Daily Site Field Assistant & Reporter",
    weather: "Weather-Aware Construction Risk Advisory",
    knowledge: "Construction Codes & OSHA Standards Assistant",
  };

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 15, 29, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 36px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="live-pulse"></span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#34d399', letterSpacing: '0.05em' }}>
            SITE LIVE
          </span>
        </div>
        <div style={{ height: '18px', width: '1px', background: 'var(--border-subtle)' }} />
        <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {viewTitles[activeView] || "Multimodal Construction Intelligence"}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <Cpu size={14} color={hasCustomKey ? "#34d399" : "var(--accent-amber)"} />
          <span>Engine:</span>
          <strong style={{ color: hasCustomKey ? "#34d399" : "var(--accent-amber)" }}>
            {hasCustomKey ? "Gemini 2.0 Flash" : "Civil Vision Simulator"}
          </strong>
        </div>

        <button
          onClick={onOpenSettings}
          className="btn btn-secondary"
          style={{ padding: '7px 12px', fontSize: '12px' }}
          title="Configure Multimodal AI API Key"
        >
          <Settings size={15} />
          <span>AI Config</span>
        </button>
      </div>
    </header>
  );
}
