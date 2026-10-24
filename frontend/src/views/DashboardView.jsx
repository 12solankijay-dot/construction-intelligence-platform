import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  CalendarClock, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  CloudSun, 
  FileText, 
  ArrowUpRight, 
  RefreshCw,
  Download,
  Settings,
  ExternalLink,
  Server,
  Sparkles
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { api, getApiBaseUrl } from '../api/client';

const DEMO_DASHBOARD = {
  timestamp: new Date().toLocaleString(),
  project_name: "Metro Sky Tower - Multimodal Construction Intelligence",
  overall_health_score: 82,
  safety_compliance_score: 72,
  structural_integrity_score: 78,
  schedule_adherence_pct: 88,
  budget_adherence_pct: 94,
  active_safety_violations: 3,
  open_structural_defects: 2,
  weather_workability_status: "CAUTION_AFTERNOON_WINDS",
  total_workers_on_site: 79,
  recent_inspections: [
    { id: "SAFE-8F12A", module: "Site Safety PPE", zone: "Zone 4 Scaffolding", status: "Action Required", score: 72, time: "10 mins ago" },
    { id: "DEFECT-4B29C", module: "Defect / Crack Vision", zone: "Floor 3 Transfer Girder", status: "Severe Shear Crack (1.65mm)", score: 62, time: "45 mins ago" },
    { id: "VAL-99A10", module: "Cost Estimator BOQ", zone: "Commercial Phase 1", status: "Capex $7.6M Est.", score: 94, time: "2 hours ago" },
    { id: "WX-33D81", module: "Weather Risk Advisor", zone: "Site Wide", status: "Caution: Afternoon Gusts", score: 85, time: "3 hours ago" }
  ],
  recent_blockers: [
    { id: "BLK-901", issue: "RMC batching transit delay due to expressway gridlock", impact: "1 day", severity: "MEDIUM" },
    { id: "BLK-902", issue: "Tower crane hydraulic seal inspection required", impact: "4 hours", severity: "HIGH" }
  ],
  critical_milestones: [
    { milestone: "Floor 4 Slab Cast & Monolithic Pour", target: "2026-10-25", status: "On Track", progress: 85 },
    { milestone: "Curtain Wall Glazing Delivery - Phase 2", target: "2026-11-04", status: "Pending", progress: 20 },
    { milestone: "Substation Power Energization", target: "2026-11-18", status: "Scheduled", progress: 0 }
  ],
  executive_summary_bullets: [
    "Overall Project Health Index stands at 82% with active works progressing across 6 operational zones.",
    "Site Safety Compliance is rated at 72% due to elevated harness non-compliance in Sector B scaffolding.",
    "Structural Crack Detection flagged a 1.65 mm shear crack on Floor 3 Transfer Girder; temporary shoring is initiated.",
    "Weather intelligence advises executing mass slab concreting prior to 12:00 PM before wind gusts exceed 34 km/h.",
    "Total on-site workforce stands at 79 personnel with optimal productivity reported."
  ]
};

export default function DashboardView({ onNavigate, onOpenSettings }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboardOverview();
      setData(res);
      setIsDemoMode(false);
    } catch (err) {
      setError(err.message || "Failed to load dashboard overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleEnableDemoMode = () => {
    setData(DEMO_DASHBOARD);
    setError(null);
    setIsDemoMode(true);
  };

  const handleExportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `construction-intelligence-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="view-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div className="spinner" style={{ width: '36px', height: '36px', borderColor: 'rgba(245, 158, 11, 0.2)', borderTopColor: 'var(--accent-amber)' }}></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading Executive Intelligence telemetry...</p>
      </div>
    );
  }

  if (error) {
    const currentApi = getApiBaseUrl();
    return (
      <div className="view-content">
        <div className="glass-panel" style={{ 
          padding: '28px', 
          borderColor: 'rgba(245, 158, 11, 0.4)', 
          background: 'rgba(15, 23, 42, 0.95)',
          maxWidth: '800px',
          margin: '20px auto',
          borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fbbf24', marginBottom: '14px' }}>
            <Server size={24} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>FastAPI Backend Not Connected Yet</span>
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your frontend is live on Vercel, but the browser is trying to connect to:
          </p>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.4)', 
            padding: '10px 14px', 
            borderRadius: '8px', 
            margin: '10px 0 16px 0', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '12.5px',
            color: 'var(--accent-cyan)' 
          }}>
            {currentApi}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            To connect your live Python backend, deploy it to <strong>Render</strong> using the pre-configured Blueprint, then copy the Render URL here:
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
            <a 
              href="https://render.com/deploy?repo=https://github.com/12solankijay-dot/construction-intelligence-platform" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none' }}
            >
              <ExternalLink size={15} /> 1-Click Deploy Backend on Render
            </a>

            {onOpenSettings && (
              <button 
                onClick={onOpenSettings} 
                className="btn btn-secondary" 
                style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px' }}
              >
                <Settings size={15} /> Enter Render Backend URL
              </button>
            )}

            <button 
              onClick={handleEnableDemoMode} 
              className="btn btn-secondary" 
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px', borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399' }}
            >
              <Sparkles size={15} /> Preview with Demo Telemetry
            </button>

            <button 
              onClick={fetchOverview} 
              className="btn btn-secondary" 
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px' }}
            >
              <RefreshCw size={15} /> Retry
            </button>
          </div>

          <div style={{ 
            padding: '12px 14px', 
            background: 'rgba(239, 68, 68, 0.08)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: '8px', 
            fontSize: '12px', 
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={15} /> Connection status: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {isDemoMode && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12.5px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
            <Sparkles size={16} />
            <span><strong>Demonstration Mode Active:</strong> Displaying simulated construction intelligence telemetry.</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {onOpenSettings && (
              <button onClick={onOpenSettings} className="btn btn-secondary" style={{ fontSize: '11.5px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Settings size={13} /> Connect Render Backend
              </button>
            )}
            <button onClick={fetchOverview} className="btn btn-secondary" style={{ fontSize: '11.5px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <RefreshCw size={13} /> Re-check Live Backend
            </button>
          </div>
        </div>
      )}

      {/* Top Banner / Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Executive Command Center</span>
          <h1 className="title-primary">{data?.project_name || "Metro Sky Tower Intelligence"}</h1>
          <p className="subtitle">Real-time cross-module telemetry & AI multimodal decision support.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchOverview} className="btn btn-secondary" style={{ fontSize: '12px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleExportJSON} className="btn btn-primary" style={{ fontSize: '12px' }}>
            <Download size={14} /> Export Audit Report (JSON)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid-4">
        <MetricCard
          title="Overall Project Health"
          value={data.overall_health_score}
          unit="/100"
          change="3.2% this week"
          changeType="positive"
          icon={Activity}
          badge="Healthy"
          color="amber"
        />
        <MetricCard
          title="Safety Compliance Index"
          value={data.safety_compliance_score}
          unit="%"
          change="Harness violation active"
          changeType="negative"
          icon={ShieldAlert}
          badge="High Risk"
          color="red"
        />
        <MetricCard
          title="Structural Integrity"
          value={data.structural_integrity_score}
          unit="%"
          change="Shear crack shored"
          changeType="positive"
          icon={AlertTriangle}
          badge="Monitoring"
          color="blue"
        />
        <MetricCard
          title="Schedule Adherence"
          value={data.schedule_adherence_pct}
          unit="%"
          change="Phase 2 on track"
          changeType="positive"
          icon={CalendarClock}
          badge="Critical Path"
          color="emerald"
        />
      </div>

      {/* Main Grid: Executive Summary & Live Alerts */}
      <div className="grid-2">
        {/* Executive AI Insights */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-amber)" /> Executive AI Intelligence Summary
            </h3>
            <span className="badge badge-emerald">Real-time AI</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.executive_summary_bullets.map((bullet, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  padding: '12px 14px', 
                  background: 'rgba(30, 41, 59, 0.4)', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: 'var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {idx + 1}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Multimodal Inspections & Telemetry */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--accent-cyan)" /> Recent Multimodal Inspections
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Latest Field Activity</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.recent_inspections.map((insp) => (
              <div
                key={insp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                      {insp.module}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      [{insp.id}]
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {insp.zone} • {insp.status}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: insp.score >= 80 ? '#34d399' : insp.score >= 65 ? '#fbbf24' : '#f87171'
                  }}>
                    {insp.score}/100
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {insp.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Module Launchpad */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('safety')} className="btn btn-outline-amber" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
              Run Safety PPE Scan
            </button>
            <button onClick={() => onNavigate('crack')} className="btn btn-outline-amber" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
              Inspect Crack Defect
            </button>
            <button onClick={() => onNavigate('valuation')} className="btn btn-outline-amber" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
              Compute BOQ Valuation
            </button>
          </div>
        </div>
      </div>

      {/* Critical Path Milestones & Blockers Row */}
      <div className="grid-2">
        {/* Critical Milestones */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarClock size={18} color="var(--accent-emerald)" /> Critical Path Milestones
            </h3>
            <button onClick={() => onNavigate('planning')} className="btn btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }}>
              View WBS <ArrowUpRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.critical_milestones.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{m.milestone}</span>
                  <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{m.target}</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${m.progress}%`,
                    background: m.progress === 100 ? '#10b981' : 'linear-gradient(90deg, #f59e0b, #3b82f6)',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Blockers */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--accent-red)" /> Active Field Blockers
            </h3>
            <button onClick={() => onNavigate('daily_log')} className="btn btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }}>
              Field Log <ArrowUpRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.recent_blockers.map((b) => (
              <div 
                key={b.id} 
                style={{ 
                  padding: '12px 14px', 
                  borderRadius: '8px', 
                  background: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f87171' }}>
                    {b.issue}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Severity: <strong>{b.severity}</strong> • Estimated Delay: {b.impact}
                  </div>
                </div>
                <span className="badge badge-red">{b.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
