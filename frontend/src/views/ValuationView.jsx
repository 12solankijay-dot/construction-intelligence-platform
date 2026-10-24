import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Building, 
  PieChart, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';

export default function ValuationView() {
  const [projectType, setProjectType] = useState('COMMERCIAL');
  const [area, setArea] = useState(35000);
  const [floors, setFloors] = useState(6);
  const [basements, setBasements] = useState(1);
  const [quality, setQuality] = useState('PREMIUM');
  const [location, setLocation] = useState('TIER_1_METRO');
  const [soil, setSoil] = useState('NORMAL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.estimateValuation({
        project_type: projectType,
        total_built_up_area_sqft: parseFloat(area),
        floors_count: parseInt(floors, 10),
        basement_count: parseInt(basements, 10),
        construction_quality: quality,
        location_tier: location,
        soil_foundation_type: soil
      });
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to calculate valuation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Epic 4 • Financial & Estimation Intelligence</span>
        <h1 className="title-primary">Real Estate Valuation & Bill of Quantities (BOQ) Estimator</h1>
        <p className="subtitle">
          AI parametric cost modeling, material quantity takeoff, regional index adjustment, and completed market ROI forecasting.
        </p>
      </div>

      {/* Input Parameters Form */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={18} color="var(--accent-amber)" /> Project Specifications & Parameters
        </h3>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Asset Classification</label>
            <select className="form-control" value={projectType} onChange={(e) => setProjectType(e.target.value)}>
              <option value="COMMERCIAL">Commercial Office / Mixed-Use</option>
              <option value="RESIDENTIAL">Multi-Family Residential Tower</option>
              <option value="INDUSTRIAL">Industrial Logistics & Warehouse</option>
              <option value="INFRASTRUCTURE">Civil Infrastructure & Public Facility</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Construction Specification Tier</label>
            <select className="form-control" value={quality} onChange={(e) => setQuality(e.target.value)}>
              <option value="STANDARD">Standard Commercial Grade</option>
              <option value="PREMIUM">Premium Grade (Class A Finishes)</option>
              <option value="LUXURY">Luxury High-End Architectural</option>
              <option value="ULTRA_LUXURY">Ultra-Luxury Iconic Landmark</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Geographic Location Tier</label>
            <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="TIER_1_METRO">Tier 1 Metro (High Material & Labor Cost)</option>
              <option value="TIER_2_URBAN">Tier 2 Urban Center</option>
              <option value="TIER_3_SUBURBAN">Tier 3 Suburban / Developing Zone</option>
              <option value="SPECIAL_ECONOMIC_ZONE">Special Economic Zone (SEZ)</option>
            </select>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '14px' }}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label">Total Built-Up Area</label>
              <span style={{ fontSize: '13px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                {Number(area).toLocaleString()} sq ft
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="200000"
              step="1000"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-amber)', margin: '8px 0' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Floors (Above Ground)</label>
            <input
              type="number"
              min="1"
              max="60"
              className="form-control"
              value={floors}
              onChange={(e) => setFloors(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Soil & Substructure Condition</label>
            <select className="form-control" value={soil} onChange={(e) => setSoil(e.target.value)}>
              <option value="NORMAL">Standard Firm Soil (Isolated Footings)</option>
              <option value="SOFT_CLAY">Soft Clay (Deep Mat Foundation)</option>
              <option value="ROCKY">Hard Strata / Rocky (Rock Anchoring)</option>
              <option value="PILING_REQUIRED">High Water Table / Deep Piling Required</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            {loading ? (
              <>
                <div className="spinner" /> Calculating Quantities & Valuation...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Compute AI Valuation & BOQ
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Financial Overview */}
          <div className="grid-3">
            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Estimated Capex
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                ${result.total_estimated_construction_cost.toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Unit Cost: <strong>${result.cost_per_sqft}</strong> / sq ft
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid #10b981' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Completed Market Valuation
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                ${result.estimated_completed_market_value.toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Based on {result.location_tier} multiplier ({result.regional_cost_multiplier}x)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Projected Development ROI
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#60a5fa', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                +{result.projected_roi_percentage}%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Net Gain: ${(result.estimated_completed_market_value - result.total_estimated_construction_cost).toLocaleString()}
              </div>
            </div>
          </div>

          {/* AI Investment Verdict */}
          <div className="glass-panel" style={{ padding: '20px 24px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--accent-amber)' }}>
              <Sparkles size={16} /> AI Investment & Feasibility Verdict:
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
              {result.ai_investment_verdict}
            </p>
          </div>

          {/* Bill of Quantities (BOQ) Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" /> Itemized Bill of Quantities (BOQ) Breakdown
            </h3>

            <div className="grid-2">
              {/* Cost distribution items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px' }}>
                  <span>Civil & Structural Works (38%)</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>${result.boq.civil_structural.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px' }}>
                  <span>Finishing & Facade Glazing (22%)</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>${result.boq.finishing_facade.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px' }}>
                  <span>MEP (Mechanical, Electrical, HVAC, Plumbing) (18%)</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>${result.boq.mep_electrical_plumbing_hvac.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px' }}>
                  <span>Labor Workforce & Site Superintending (12%)</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>${result.boq.labor_workforce.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px' }}>
                  <span>Statutory Permits & Architectural Fees (4%)</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>${result.boq.regulatory_permits_architectural.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <span style={{ color: 'var(--accent-amber)' }}>Risk & Escalation Contingency Reserve (6%)</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>${result.boq.contingency_reserve.toLocaleString()}</strong>
                </div>
              </div>

              {/* Civil Material Quantities */}
              <div style={{ background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Core Structural Materials Takeoff:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.boq.civil_materials.map((mat, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: '#f8fafc' }}>
                        <span>{mat.item}</span>
                        <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>${mat.estimated_cost.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <span>Quantity: <strong>{mat.quantity.toLocaleString()}</strong> {mat.unit}</span>
                        <span>Rate: ${mat.rate_per_unit} / unit</span>
                      </div>
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
