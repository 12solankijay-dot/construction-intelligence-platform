import React from 'react';

export default function MetricCard({ title, value, unit = '', change, changeType = 'positive', icon: Icon, badge, color = 'amber' }) {
  const colorMap = {
    amber: { border: 'rgba(245, 158, 11, 0.3)', bg: 'rgba(245, 158, 11, 0.08)', text: '#fbbf24' },
    emerald: { border: 'rgba(16, 185, 129, 0.3)', bg: 'rgba(16, 185, 129, 0.08)', text: '#34d399' },
    blue: { border: 'rgba(59, 130, 246, 0.3)', bg: 'rgba(59, 130, 246, 0.08)', text: '#60a5fa' },
    red: { border: 'rgba(239, 68, 68, 0.3)', bg: 'rgba(239, 68, 68, 0.08)', text: '#f87171' },
    purple: { border: 'rgba(139, 92, 246, 0.3)', bg: 'rgba(139, 92, 246, 0.08)', text: '#a78bfa' },
  };

  const theme = colorMap[color] || colorMap.amber;

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.02em' }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {value}
            </span>
            {unit && <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.text,
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {change && (
          <span style={{
            fontSize: '12px',
            color: changeType === 'positive' ? '#34d399' : '#f87171',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {changeType === 'positive' ? '▲' : '▼'} {change}
          </span>
        )}
        {badge && (
          <span className={`badge badge-${color}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
