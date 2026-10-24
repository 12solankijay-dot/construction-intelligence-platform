import React, { useState } from 'react';
import { 
  ClipboardList, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Truck,
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { api } from '../api/client';

export default function DailyLogView() {
  const [date, setDate] = useState('2026-10-24');
  const [siteName, setSiteName] = useState('Metro Sky Tower Project');
  const [supervisor, setSupervisor] = useState('Site Superintendent Dave Miller');
  const [weather, setWeather] = useState('Partly Cloudy, 28°C, Wind 18 km/h');
  const [engineers, setEngineers] = useState(4);
  const [supervisors, setSupervisors] = useState(4);
  const [skilled, setSkilled] = useState(32);
  const [unskilled, setUnskilled] = useState(48);
  const [fieldNotes, setFieldNotes] = useState(
    "Cast 45 cubic meters of concrete on Floor 3 west beam line. Ready-mix concrete delivery delayed by 40 minutes due to expressway bottleneck. Afternoon rain shower halted exterior brickwork for 1.5 hours; diverted masonry crew to basement duct sealing. Tower Crane #1 hydraulic line inspection cleared. Zero injuries reported."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.submitDailyLog({
        date,
        site_name: siteName,
        supervisor_name: supervisor,
        weather_condition: weather,
        workforce: {
          engineers: parseInt(engineers, 10),
          supervisors: parseInt(supervisors, 10),
          skilled_labor: parseInt(skilled, 10),
          unskilled_labor: parseInt(unskilled, 10)
        },
        active_zones: ["Zone 2 Floor 3 West Beam Pour", "Zone 1 Basement Waterproofing"],
        equipment_deployed: [
          { equipment: "Tower Crane #1", hours: 7.5, status: "Operational" },
          { equipment: "Concrete Boom Pump", hours: 5.0, status: "Operational" },
          { equipment: "Mini Excavator", hours: 3.0, status: "Maintenance" }
        ],
        field_notes: fieldNotes
      });
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to submit daily field log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Epic 6 • Field Operations & Blocker Detection</span>
        <h1 className="title-primary">Daily Site Log & Field Assistant (Daily Reporter)</h1>
        <p className="subtitle">
          Convert unstructured supervisor field logs into structured intelligence, bottleneck detection, and tomorrow's operational schedule.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClipboardList size={18} color="var(--accent-amber)" /> Daily Supervisor Shift Entry
        </h3>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Shift Date</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Site / Project Name</label>
            <input type="text" className="form-control" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Supervising Engineer</label>
            <input type="text" className="form-control" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />
          </div>
        </div>

        {/* Workforce headcount */}
        <div style={{ marginTop: '16px', background: 'rgba(30, 41, 59, 0.4)', padding: '16px 20px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="var(--accent-cyan)" /> Workforce Headcount Distribution:
          </div>
          <div className="grid-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11.5px' }}>Field Engineers</label>
              <input type="number" className="form-control" value={engineers} onChange={(e) => setEngineers(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11.5px' }}>Trade Supervisors</label>
              <input type="number" className="form-control" value={supervisors} onChange={(e) => setSupervisors(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11.5px' }}>Skilled Trades (Masons, Fitters)</label>
              <input type="number" className="form-control" value={skilled} onChange={(e) => setSkilled(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11.5px' }}>Helpers / Unskilled Labor</label>
              <input type="number" className="form-control" value={unskilled} onChange={(e) => setUnskilled(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Unstructured Voice/Notes */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Unstructured Field Log / Audio Transcript Notes</span>
            <span style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>AI Auto-extracts Blockers & Delays</span>
          </label>
          <textarea
            className="form-control"
            rows="4"
            value={fieldNotes}
            onChange={(e) => setFieldNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            {loading ? (
              <>
                <div className="spinner" /> Synthesizing Shift Log & Blockers...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Process & Audit Daily Field Log
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderLeft: `6px solid ${result.ai_site_sentiment === 'ON_TRACK' ? '#10b981' : '#f59e0b'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge badge-${result.ai_site_sentiment === 'ON_TRACK' ? 'emerald' : 'amber'}`}>
                    Sentiment: {result.ai_site_sentiment}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Log ID: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{result.log_id}</strong>
                  </span>
                  <span className="badge badge-blue">
                    Productivity: {result.productivity_index}
                  </span>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                  Shift Report: {result.site_name} ({result.date})
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '850px' }}>
                  {result.executive_daily_summary}
                </p>
              </div>

              <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '16px 28px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Manpower Deployed
                </div>
                <div style={{ fontSize: '38px', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {result.total_manpower}
                </div>
                <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                  {result.safety_health_status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* Blockers & Today's Achievements */}
          <div className="grid-2">
            {/* Detected Blockers */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--accent-red)" /> AI-Detected Operational Blockers ({result.detected_blockers.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.detected_blockers.map((b) => (
                  <div
                    key={b.blocker_id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f87171' }}>
                        {b.issue}
                      </span>
                      <span className="badge badge-red">{b.severity}</span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Category: {b.category} • Schedule Slip: <strong>{b.impact_days} day(s)</strong>
                    </div>

                    <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--accent-amber)' }}>Resolution Path:</strong> {b.resolution_path}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Achievements & Tomorrow Priorities */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" /> Key Shift Accomplishments
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.key_achievements.map((ach, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} color="var(--accent-emerald)" /> {ach}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="var(--accent-amber)" /> Tomorrow's Critical Shift Priorities
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.tomorrow_priorities.map((prio, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
                      {prio}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
