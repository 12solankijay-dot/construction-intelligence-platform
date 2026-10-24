import React, { useState } from 'react';
import { 
  CalendarClock, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Sparkles,
  ArrowRight,
  Package
} from 'lucide-react';
import { api } from '../api/client';

export default function PlanningView() {
  const [projectName, setProjectName] = useState('Metro Sky Tower & Commercial Hub');
  const [projectType, setProjectType] = useState('COMMERCIAL');
  const [area, setArea] = useState(48000);
  const [floors, setFloors] = useState(8);
  const [durationMonths, setDurationMonths] = useState(18);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.generatePlan({
        project_name: projectName,
        project_type: projectType,
        built_up_area_sqft: parseFloat(area),
        floors: parseInt(floors, 10),
        target_duration_months: parseInt(durationMonths, 10),
        start_date: startDate
      });
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to generate project schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Epic 5 • Planning & WBS Optimization</span>
        <h1 className="title-primary">Construction Project Planning & Scheduling Assistant</h1>
        <p className="subtitle">
          AI-generated Work Breakdown Structure (WBS), critical path sequencing, phased duration math, and procurement triggers.
        </p>
      </div>

      {/* Input Parameters */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarClock size={18} color="var(--accent-amber)" /> Schedule Formulation Constraints
        </h3>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              className="form-control"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Structure Type</label>
            <select className="form-control" value={projectType} onChange={(e) => setProjectType(e.target.value)}>
              <option value="COMMERCIAL">Commercial Office Tower</option>
              <option value="RESIDENTIAL">High-Rise Residential</option>
              <option value="INDUSTRIAL">Logistics & Industrial Center</option>
              <option value="HOSPITALITY">Hotel & Hospitality Resort</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Completion (Months)</label>
            <input
              type="number"
              min="3"
              max="60"
              className="form-control"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '12px' }}>
          <div className="form-group">
            <label className="form-label">Built-Up Area (sq ft)</label>
            <input
              type="number"
              className="form-control"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Storeys / Floors</label>
            <input
              type="number"
              className="form-control"
              value={floors}
              onChange={(e) => setFloors(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Commencement Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            {loading ? (
              <>
                <div className="spinner" /> Sequencing Work Breakdown Structure...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate AI Project Schedule
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Summary */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '6px solid var(--accent-amber)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-emerald">WBS Complete</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Plan ID: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{result.plan_id}</strong>
                  </span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                  {result.project_name}
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '850px' }}>
                  {result.ai_planning_insights}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '18px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TOTAL DURATION</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                    {result.total_duration_days} <span style={{ fontSize: '13px' }}>Days</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>HANDOVER TARGET</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    {result.projected_completion_date}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', fontSize: '12.5px', color: '#f87171' }}>
              <strong>Critical Path Sequence:</strong> {result.critical_path_summary}
            </div>
          </div>

          {/* Phased WBS Timeline Cards */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" /> Phased Work Breakdown Structure (6 Construction Gates)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {result.phases.map((ph) => (
                <div
                  key={ph.phase_id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '10px',
                    padding: '18px 20px',
                    border: `1px solid ${ph.is_critical_path ? 'rgba(245, 158, 11, 0.35)' : 'var(--border-subtle)'}`,
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: ph.is_critical_path ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          color: ph.is_critical_path ? 'var(--accent-amber)' : '#60a5fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          {ph.phase_id}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
                          {ph.name}
                        </h4>
                        {ph.is_critical_path && (
                          <span className="badge badge-amber">Critical Path</span>
                        )}
                        <span className={`badge badge-${ph.status === 'COMPLETED' ? 'emerald' : ph.status === 'IN_PROGRESS' ? 'blue' : 'purple'}`}>
                          {ph.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Duration: <strong>{ph.duration_days} days</strong> (Days {ph.start_day} - {ph.end_day}) • Workforce Required: <strong>{ph.workforce_headcount} workers</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Phase Progress</span>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {ph.completion_percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', margin: '14px 0 12px 0', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${ph.completion_percentage}%`,
                      background: ph.status === 'COMPLETED' ? '#10b981' : 'linear-gradient(90deg, #f59e0b, #3b82f6)',
                      borderRadius: '3px'
                    }} />
                  </div>

                  {/* Deliverables */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Key Engineering Deliverables:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '6px' }}>
                      {ph.key_deliverables.map((del, dIdx) => (
                        <div key={dIdx} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={13} color="var(--accent-emerald)" /> {del}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones & Procurement Triggers */}
          <div className="grid-2">
            {/* Major Milestones */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--accent-emerald)" /> Major Contract Milestones
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.major_milestones.map((ms, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ms.critical ? 'var(--accent-amber)' : 'var(--accent-blue)' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc' }}>{ms.milestone}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                      {ms.target_date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procurement Lead Times */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="var(--accent-purple)" /> Procurement Order Triggers
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.recommended_procurement_lead_times.map((pr, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{pr.material}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trigger Phase: {pr.trigger_phase}</div>
                    </div>
                    <span className="badge badge-purple">
                      {pr.order_lead_time_weeks} Wks Lead Time
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
