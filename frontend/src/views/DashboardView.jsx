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
  Download
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { api } from '../api/client';

export default function DashboardView({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboardOverview();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load dashboard overview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

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
    return (
      <div className="view-content">
        <div className="glass-panel" style={{ padding: '24px', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f87171' }}>
            <AlertTriangle size={20} />
            <span style={{ fontWeight: 600 }}>Backend Connection Error: {error}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Ensure the FastAPI backend is running on port 8000.
          </p>
          <button onClick={fetchOverview} className="btn btn-secondary" style={{ marginTop: '14px', fontSize: '12px' }}>
            <RefreshCw size={14} /> Retry Telemetry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
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
