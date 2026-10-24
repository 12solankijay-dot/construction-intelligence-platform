import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  HardHat, 
  Sparkles, 
  FileCheck,
  RotateCcw
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { api } from '../api/client';

export default function SafetyView() {
  const [siteName, setSiteName] = useState('Metro Sky Tower Project');
  const [zone, setZone] = useState('Zone 4 - Elevated Scaffolding & Superstructure');
  const [inspectorName, setInspectorName] = useState('Chief Safety Officer Sarah Jenkins');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageB64, setSelectedImageB64] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Sample presets for instant testing
  const samplePresets = [
    {
      name: "Sample 1: Elevated Scaffolding & Fall Hazard",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%231e293b'/><text x='30' y='60' fill='%23fbbf24' font-size='22' font-family='sans-serif' font-weight='bold'>CONSTRUCTION SITE INSPECTION: ZONE 4</text><rect x='40' y='100' width='520' height='240' fill='%230f172a' stroke='%23334155' stroke-width='2'/><text x='70' y='160' fill='%2394a3b8' font-size='16' font-family='sans-serif'>[Worker detected at +24ft elevation on tubular scaffolding]</text><text x='70' y='200' fill='%2334d399' font-size='16' font-family='sans-serif'>✓ Hardhat detected (ANSI Z89.1)</text><text x='70' y='240' fill='%23f87171' font-size='16' font-family='sans-serif'>✗ Missing Fall Arrest Lanyard Tie-off (OSHA 1926.501)</text><text x='70' y='280' fill='%23fbbf24' font-size='16' font-family='sans-serif'>! Scaffolding missing perimeter midrail</text></svg>"
    },
    {
      name: "Sample 2: Ground Crew Rebar & Heavy Equipment",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%231e293b'/><text x='30' y='60' fill='%2338bdf8' font-size='22' font-family='sans-serif' font-weight='bold'>CONSTRUCTION SITE INSPECTION: ZONE 1 FOUNDATION</text><rect x='40' y='100' width='520' height='240' fill='%230f172a' stroke='%23334155' stroke-width='2'/><text x='70' y='160' fill='%2394a3b8' font-size='16' font-family='sans-serif'>[Ground Crew operating near 30T Mobile Crane Swing Radius]</text><text x='70' y='200' fill='%2334d399' font-size='16' font-family='sans-serif'>✓ Steel-Toe boots & gloves compliant</text><text x='70' y='240' fill='%23f87171' font-size='16' font-family='sans-serif'>✗ 2 workers in crane swing blindspot without Class 3 High-Vis</text><text x='70' y='280' fill='%2334d399' font-size='16' font-family='sans-serif'>✓ Hardhat compliance 100%</text></svg>"
    }
  ];

  const handleImageSelected = (file, dataUri) => {
    setSelectedFile(file);
    setSelectedImageB64(dataUri);
  };

  const handleRunInspection = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('site_name', siteName);
        formData.append('zone', zone);
        formData.append('inspector_name', inspectorName);
        res = await api.uploadInspectSafety(formData);
      } else {
        res = await api.inspectSafety({
          site_name: siteName,
          zone: zone,
          inspector_name: inspectorName,
          image_base64: selectedImageB64 || undefined
        });
      }

      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to analyze safety conditions.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Epic 2 • Computer Vision</span>
        <h1 className="title-primary">Construction Site Safety & PPE Hazard Monitoring</h1>
        <p className="subtitle">
          Multimodal vision auditing for Personal Protective Equipment (PPE), fall arrest compliance, and physical site hazards.
        </p>
      </div>

      {/* Input Configuration & Uploader */}
      <div className="grid-2">
        {/* Upload Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="var(--accent-amber)" /> Multimodal Image Ingestion
          </h3>

          <ImageUploader
            label="Upload Site Photo for Multimodal Safety Scan"
            samplePresets={samplePresets}
            onImageSelected={handleImageSelected}
          />
        </div>

        {/* Audit Parameters & Form */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck size={18} color="var(--accent-cyan)" /> Site Inspection Metadata
            </h3>

            <div className="form-group">
              <label className="form-label">Project / Jobsite Name</label>
              <input
                type="text"
                className="form-control"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Active Work Zone / Structural Sector</label>
              <input
                type="text"
                className="form-control"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Safety Officer</label>
              <input
                type="text"
                className="form-control"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleRunInspection}
              disabled={analyzing}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            >
              {analyzing ? (
                <>
                  <div className="spinner" /> Analyzing Image with Multimodal AI...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run Multimodal Safety Audit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Summary Score Bar */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderLeft: `6px solid ${result.overall_safety_score >= 80 ? '#10b981' : result.overall_safety_score >= 60 ? '#f59e0b' : '#ef4444'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge badge-${result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH' ? 'red' : 'emerald'}`}>
                    Risk Level: {result.risk_level}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Inspection ID: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{result.inspection_id}</strong>
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Engine: <strong style={{ color: 'var(--accent-amber)' }}>{result.model_used}</strong>
                  </span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                  {result.site_name} — {result.zone}
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '850px' }}>
                  {result.ai_analysis_summary}
                </p>
              </div>

              <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '16px 28px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Site Safety Index
                </div>
                <div style={{
                  fontSize: '42px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: result.overall_safety_score >= 80 ? '#34d399' : result.overall_safety_score >= 60 ? '#fbbf24' : '#f87171'
                }}>
                  {result.overall_safety_score}<span style={{ fontSize: '18px', color: 'var(--text-dim)' }}>/100</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {result.person_count_detected} Personnel In Frame
                </div>
              </div>
            </div>
          </div>

          {/* PPE Compliance Matrix */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardHat size={18} color="var(--accent-amber)" /> PPE Gear Compliance Detection Matrix
            </h3>

            <div className="grid-3">
              {result.ppe_compliance.map((item, idx) => {
                const isCompliant = item.status === 'Compliant';
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '10px',
                      padding: '16px',
                      border: `1px solid ${isCompliant ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#f8fafc' }}>
                        {item.item_name}
                      </span>
                      <span className={`badge badge-${isCompliant ? 'emerald' : 'red'}`}>
                        {item.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', minHeight: '36px' }}>
                      {item.details}
                    </p>

                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
                      <span>Compliant: <strong style={{ color: '#34d399' }}>{item.count_compliant}</strong></span>
                      <span>Missing: <strong style={{ color: '#f87171' }}>{item.count_missing}</strong></span>
                      <span>Confidence: <strong style={{ color: 'var(--accent-amber)' }}>{(item.confidence * 100).toFixed(0)}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detected Hazards & Corrective Protocol */}
          <div className="grid-2">
            {/* Hazards Detected */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="var(--accent-red)" /> Identified Hazards & Violations ({result.hazards_detected.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {result.hazards_detected.map((haz) => (
                  <div
                    key={haz.hazard_id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid rgba(239, 68, 68, 0.25)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f87171' }}>
                        {haz.category}
                      </span>
                      <span className="badge badge-red">{haz.severity}</span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Location: {haz.location_in_frame}
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                      {haz.description}
                    </p>

                    <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: '6px', fontSize: '12px' }}>
                      <strong style={{ color: 'var(--accent-amber)' }}>Action:</strong> {haz.immediate_action}
                    </div>

                    {haz.osha_reference && (
                      <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
                        Regulation: {haz.osha_reference}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Corrective Actions & OSHA Citations */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" /> Mandatory Corrective Safety Checklist
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.corrective_actions.map((act, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <input type="checkbox" style={{ marginTop: '3px', accentColor: 'var(--accent-amber)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {act}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Cited OSHA 1926 Standards:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {result.osha_citations.map((cite, idx) => (
                    <span key={idx} style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      • {cite}
                    </span>
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
