import React, { useState } from 'react';
import { 
  CloudSunRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Sparkles,
  Compass
} from 'lucide-react';
import { api } from '../api/client';

export default function WeatherView() {
  const [location, setLocation] = useState('San Francisco Bay Jobsite, CA');
  const [activities, setActivities] = useState([
    'CONCRETE_POUR', 'CRANE_LIFTING', 'EXCAVATION', 'EXTERNAL_GLAZING', 'ROOFING_HOT_TAR'
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const toggleActivity = (act) => {
    if (activities.includes(act)) {
      setActivities(activities.filter(a => a !== act));
    } else {
      setActivities([...activities, act]);
    }
  };

  const handleFetchAdvisory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getWeatherAdvisory({
        city_or_coordinates: location,
        planned_activities: activities
      });
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to fetch weather advisory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Epic 7 • Meteorological Risk Intelligence</span>
        <h1 className="title-primary">Weather-Aware Construction Advisory</h1>
        <p className="subtitle">
          Environmental condition impact analysis on concrete curing (ACI 305), crane wind safety limits, and 5-day task workability.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="var(--accent-amber)" /> Site Meteorological Parameters
        </h3>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Jobsite City or Coordinate Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Active & Planned Outdoor Activities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {[
                { id: 'CONCRETE_POUR', label: 'Mass Concrete Pour' },
                { id: 'CRANE_LIFTING', label: 'Tower Crane Hoisting' },
                { id: 'EXCAVATION', label: 'Deep Excavation' },
                { id: 'EXTERNAL_GLAZING', label: 'Facade Curtain Wall' },
                { id: 'ROOFING_HOT_TAR', label: 'Roof Waterproofing' },
              ].map((act) => {
                const isSelected = activities.includes(act.id);
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => toggleActivity(act.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-amber)' : 'var(--border-subtle)',
                      background: isSelected ? 'var(--accent-amber-glow)' : 'rgba(30, 41, 59, 0.4)',
                      color: isSelected ? '#fbbf24' : 'var(--text-secondary)',
                      transition: 'all 0.15s'
                    }}
                  >
                    {act.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={handleFetchAdvisory}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            {loading ? (
              <>
                <div className="spinner" /> Analyzing Meteorological Constraints...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Run Meteorological Safety Advisory
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Weather Metric Bar */}
          <div className="grid-4">
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <Thermometer size={16} color="#fbbf24" /> Air Temperature
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                {result.current_metrics.temperature_c}°C
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {result.current_metrics.condition_description}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <Wind size={16} color="#38bdf8" /> Wind Speed / Gusts
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                {result.current_metrics.wind_speed_kmh} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>km/h</span>
              </div>
              <div style={{ fontSize: '11.5px', color: result.current_metrics.wind_gust_kmh > 30 ? '#f87171' : '#34d399' }}>
                Peak Gusts: {result.current_metrics.wind_gust_kmh} km/h
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <Droplets size={16} color="#60a5fa" /> Relative Humidity
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                {result.current_metrics.humidity_percent}%
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Precipitation Risk: {result.current_metrics.precipitation_probability_pct}%
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <CloudSunRain size={16} color="#a78bfa" /> Concrete Evap Rate
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                {result.concrete_curing_index.evaporation_rate_kg_m2_hr} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kg/m²/h</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                ACI Limit: 0.50 kg/m²/h
              </div>
            </div>
          </div>

          {/* Meteorological AI Directive */}
          <div className="glass-panel" style={{ padding: '20px 24px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#60a5fa' }}>
              <Sparkles size={16} /> Meteorological AI Advisory Directive:
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
              {result.ai_meteorological_advisory}
            </p>
          </div>

          {/* Activity Risk Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--accent-amber)" /> Task-Specific Weather Risk Matrix
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.activity_risks.map((act, idx) => {
                const badgeColor = act.status === 'GO' ? 'emerald' : act.status === 'CAUTION' ? 'amber' : 'red';
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ maxWidth: '75%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`badge badge-${badgeColor}`}>{act.status}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{act.activity_name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          Risk: {act.risk_score}/100
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        {act.risk_summary}
                      </p>
                      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--accent-amber)' }}>
                        <strong>Mitigation Directive:</strong> {act.recommended_mitigation}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '22px',
                        fontWeight: 900,
                        fontFamily: 'var(--font-mono)',
                        color: act.status === 'GO' ? '#34d399' : act.status === 'CAUTION' ? '#fbbf24' : '#f87171'
                      }}>
                        {act.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5-Day Workability Forecast */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--accent-cyan)" /> 5-Day Construction Viability Forecast
            </h3>

            <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {result.five_day_forecast.map((f, idx) => {
                const workabilityColor = f.overall_workability === 'EXCELLENT' ? 'emerald' : f.overall_workability === 'FAVORABLE' ? 'blue' : f.overall_workability === 'RESTRICTED' ? 'amber' : 'red';
                return (
                  <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '10px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{f.day}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      {f.temp_high_c}° / {f.temp_low_c}°C
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Rain: {f.rain_probability_pct}% • Gust: {f.wind_gust_kmh} km/h
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <span className={`badge badge-${workabilityColor}`}>
                        {f.overall_workability}
                      </span>
                    </div>

                    <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <strong>Advised:</strong> {f.best_activities.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
