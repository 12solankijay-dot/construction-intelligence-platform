import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckSquare, 
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { api } from '../api/client';

export default function KnowledgeView() {
  const [query, setQuery] = useState('What are OSHA mandatory fall protection and guardrail requirements on scaffolding?');
  const [category, setCategory] = useState('OSHA_SAFETY');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const samplePrompts = [
    { label: "OSHA Scaffolding & Fall Arrest (1926.451)", cat: "OSHA_SAFETY", text: "What are the OSHA requirements for scaffolding guardrails, tie-offs, and daily inspections?" },
    { label: "Concrete Slump & Curing Tolerances (ACI 308)", cat: "STRUCTURAL_ACI_IS", text: "What are the ASTM and ACI guidelines for concrete slump testing and minimum curing durations?" },
    { label: "Excavation Protective Shoring (>5ft)", cat: "OSHA_SAFETY", text: "What are OSHA trenching and excavation protective system requirements for trenches over 5 feet deep?" },
    { label: "IBC 2024 Structural Load Factors (ASCE 7)", cat: "BUILDING_CODE_IBC", text: "What are IBC 2024 basic load combinations and environmental design requirements?" }
  ];

  const handleSearch = async (textToSearch, cat) => {
    const q = textToSearch || query;
    const c = cat || category;
    if (!q.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.queryKnowledge({
        query: q,
        category: c
      });
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to query construction knowledge assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setQuery(sample.text);
    setCategory(sample.cat);
    handleSearch(sample.text, sample.cat);
  };

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Epic 8 • Regulatory & Code Intelligence</span>
        <h1 className="title-primary">Construction Knowledge Assistant (Codes & Standards AI)</h1>
        <p className="subtitle">
          Interactive domain assistant grounded in OSHA 1926 regulations, International Building Code (IBC 2024), and ACI/ASTM specifications.
        </p>
      </div>

      {/* Query Bar & Presets */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpenCheck size={18} color="var(--accent-amber)" /> Regulatory Search Query
        </h3>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {[
            { id: 'OSHA_SAFETY', label: 'OSHA 1926 Safety Regulations' },
            { id: 'BUILDING_CODE_IBC', label: 'International Building Code (IBC)' },
            { id: 'STRUCTURAL_ACI_IS', label: 'ACI 318 / IS Concrete Standards' },
            { id: 'QUALITY_ASTM', label: 'ASTM Materials Quality Testing' },
            { id: 'SUSTAINABILITY_LEED', label: 'LEED & Green Building Standards' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: category === cat.id ? 'var(--accent-amber)' : 'var(--border-subtle)',
                background: category === cat.id ? 'var(--accent-amber-glow)' : 'rgba(30, 41, 59, 0.4)',
                color: category === cat.id ? '#fbbf24' : 'var(--text-secondary)',
                transition: 'all 0.15s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-control"
            style={{ flex: 1, padding: '12px 16px', fontSize: '14px' }}
            placeholder="Ask anything about OSHA requirements, concrete tolerances, structural codes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0 24px' }}
          >
            {loading ? <div className="spinner" /> : <><Sparkles size={16} /> Consult AI</>}
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Prompts:</span>
          {samplePrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(s)}
              style={{
                fontSize: '11.5px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Answer Panel */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-amber">{result.category}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID: {result.query_id}
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
              {result.query}
            </h2>

            {/* Answer Content */}
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              padding: '16px 20px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
            }}>
              {result.detailed_answer}
            </div>
          </div>

          {/* Cited Standards & Site Checklist */}
          <div className="grid-2">
            {/* Cited Standards */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--accent-cyan)" /> Mandatory Cited Clauses & Standards
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.cited_clauses_and_standards.map((st, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                    <span style={{ fontSize: '13px', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                      {st}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                  Enforcement & Non-Compliance Liability:
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {result.enforcement_risks_and_penalties}
                </div>
              </div>
            </div>

            {/* Practical Checklist */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={18} color="var(--accent-emerald)" /> Site Engineer Compliance Checklist
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.site_compliance_checklist.map((chk, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ marginTop: '3px', accentColor: 'var(--accent-emerald)' }} />
                    <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {chk}
                    </span>
                  </label>
                ))}
              </div>

              {result.related_topics && result.related_topics.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Explore Related Regulations:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {result.related_topics.map((top, idx) => (
                      <span key={idx} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
