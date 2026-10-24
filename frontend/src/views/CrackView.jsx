import React, { useState } from 'react';
import { 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  Ruler, 
  Wrench, 
  FileText, 
  Sparkles,
  ShieldCheck,
  Flame
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { api } from '../api/client';

export default function CrackView() {
  const [componentType, setComponentType] = useState('BEAM');
  const [age, setAge] = useState(3);
  const [exposure, setExposure] = useState('EXTERIOR_HUMID');
  const [notes, setNotes] = useState('Third floor transfer girder near support column C4');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageB64, setSelectedImageB64] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const samplePresets = [
    {
      name: "Sample 1: Heavy Diagonal Shear Crack (RCC Beam)",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%231e293b'/><text x='30' y='50' fill='%23f87171' font-size='20' font-family='sans-serif' font-weight='bold'>STRUCTURAL DEFECT: TRANSFER GIRDER BEAM</text><rect x='40' y='80' width='520' height='260' fill='%230f172a' stroke='%23334155' stroke-width='2'/><path d='M100 120 L280 280 L340 320' stroke='%23ef4444' stroke-width='6' stroke-dasharray='12,4' fill='none'/><text x='110' y='180' fill='%23f87171' font-size='15' font-family='sans-serif'>Diagonal 45° Tension Shear Fracture</text><text x='110' y='210' fill='%2394a3b8' font-size='14' font-family='sans-serif'>Width: ~1.65 mm (Exceeds ACI 224R 0.3mm limit)</text></svg>"
    },
    {
      name: "Sample 2: Foundation Settlement Crack (Column Base)",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%231e293b'/><text x='30' y='50' fill='%23ef4444' font-size='20' font-family='sans-serif' font-weight='bold'>CRITICAL DEFECT: COLUMN FOOTING SUBSIDENCE</text><rect x='40' y='80' width='520' height='260' fill='%230f172a' stroke='%23334155' stroke-width='2'/><path d='M280 90 L300 240 L380 330' stroke='%23dc2626' stroke-width='8' fill='none'/><text x='70' y='160' fill='%23f87171' font-size='15' font-family='sans-serif'>Vertical/Diagonal Splitting along Main Rebar</text><text x='70' y='190' fill='%23fbbf24' font-size='14' font-family='sans-serif'>Differential settlement; immediate needle shoring required</text></svg>"
    },
    {
      name: "Sample 3: Surface Hairline Curing Crack (Floor Slab)",
      url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%231e293b'/><text x='30' y='50' fill='%2334d399' font-size='20' font-family='sans-serif' font-weight='bold'>SURFACE INSPECTION: FLOOR SLAB CURING CRACK</text><rect x='40' y='80' width='520' height='260' fill='%230f172a' stroke='%23334155' stroke-width='2'/><path d='M120 180 Q250 200 420 160' stroke='%23fbbf24' stroke-width='2' fill='none'/><text x='130' y='220' fill='%2334d399' font-size='14' font-family='sans-serif'>Hairline plastic shrinkage crack (0.28 mm)</text><text x='130' y='250' fill='%2394a3b8' font-size='13' font-family='sans-serif'>Safe to monitor; elastomeric surface seal recommended</text></svg>"
    }
  ];

  const handleImageSelected = (file, dataUri) => {
    setSelectedFile(file);
    setSelectedImageB64(dataUri);
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('component_type', componentType);
        formData.append('structural_age_years', age);
        formData.append('environmental_exposure', exposure);
        formData.append('site_location_notes', notes);
        res = await api.uploadAnalyzeCrack(formData);
      } else {
        res = await api.analyzeCrack({
          component_type: componentType,
          structural_age_years: parseInt(age, 10),
          environmental_exposure: exposure,
          site_location_notes: notes,
          image_base64: selectedImageB64 || undefined
        });
      }

      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to analyze crack defect.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Epic 3 • Structural Forensic AI</span>
        <h1 className="title-primary">Structural Crack Detection & Defect Assessment</h1>
        <p className="subtitle">
          Multimodal classification of concrete/masonry fractures, crack width/length estimation, and ACI 224R remediation guidance.
        </p>
      </div>

      {/* Input Panel */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent-amber)" /> Multimodal Defect Image Ingestion
          </h3>
          <ImageUploader
            label="Upload High-Resolution Photo of Concrete / Masonry Defect"
            samplePresets={samplePresets}
            onImageSelected={handleImageSelected}
          />
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ruler size={18} color="var(--accent-cyan)" /> Structural Element Parameters
            </h3>

            <div className="form-group">
              <label className="form-label">Structural Component Type</label>
              <select
                className="form-control"
                value={componentType}
                onChange={(e) => setComponentType(e.target.value)}
              >
                <option value="BEAM">Reinforced Concrete Beam / Girder</option>
                <option value="COLUMN">RCC Column / Pier</option>
                <option value="SLAB">Suspended Concrete Floor Slab</option>
                <option value="FOUNDATION">Foundation Footing / Raft Slab</option>
                <option value="MASONRY_WALL">Blockwork / Brick Masonry Wall</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Structure Age (Years)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Environmental Exposure</label>
                <select
                  className="form-control"
                  value={exposure}
                  onChange={(e) => setExposure(e.target.value)}
                >
                  <option value="EXTERIOR_HUMID">Exterior (Humid / Rain)</option>
                  <option value="INTERIOR_DRY">Interior Dry Controlled</option>
                  <option value="MARINE_COASTAL">Marine Coastal Splash Zone</option>
                  <option value="INDUSTRIAL">Chemical / Industrial</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Site Location Notes</label>
              <input
                type="text"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            >
              {analyzing ? (
                <>
                  <div className="spinner" /> Analyzing Structural Defect with Multimodal AI...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run Forensic Crack Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Defect Header Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderLeft: `6px solid ${result.severity === 'CRITICAL' || result.severity === 'SEVERE' ? '#ef4444' : '#f59e0b'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge badge-${result.severity === 'CRITICAL' || result.severity === 'SEVERE' ? 'red' : 'amber'}`}>
                    Severity: {result.severity}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Defect ID: <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{result.defect_id}</strong>
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Engine: <strong style={{ color: 'var(--accent-amber)' }}>{result.model_used}</strong>
                  </span>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                  {result.crack_type.replace('_', ' ')} on {result.component_type}
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '850px' }}>
                  {result.ai_vision_diagnosis}
                </p>
              </div>

              <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '16px 28px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Residual Health
                </div>
                <div style={{
                  fontSize: '42px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: result.structural_integrity_score >= 75 ? '#34d399' : result.structural_integrity_score >= 50 ? '#fbbf24' : '#f87171'
                }}>
                  {result.structural_integrity_score}%
                </div>
                <div style={{ fontSize: '11px', color: result.requires_structural_engineer_signoff ? '#f87171' : '#34d399', fontWeight: 600 }}>
                  {result.requires_structural_engineer_signoff ? "PE Signoff Required" : "Standard Remediation"}
                </div>
              </div>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid-3">
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Estimated Crack Width</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                {result.estimated_width_mm} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>mm</span>
              </div>
              <div style={{ fontSize: '11.5px', color: result.estimated_width_mm > 0.3 ? '#f87171' : '#34d399', marginTop: '6px' }}>
                {result.estimated_width_mm > 0.3 ? 'Exceeds ACI 0.3mm tolerance' : 'Within acceptable limit'}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Trace Surface Length</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                {result.estimated_length_cm} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>cm</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Continuous diagonal fracture
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Immediate Risk Protocol</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fbbf24', marginTop: '10px' }}>
                {result.immediate_risk_level.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {result.compliance_assessment}
              </div>
            </div>
          </div>

          {/* Causes & Recommended Remediation */}
          <div className="grid-2">
            {/* Probable Causes */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={18} color="var(--accent-red)" /> Probable Structural Mechanisms
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.probable_causes.map((cause, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-amber)', marginTop: '6px' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {cause}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Remediation Plan */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={18} color="var(--accent-emerald)" /> Engineering Remediation Plan
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.recommended_remediation.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {step}
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
