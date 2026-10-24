import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Activity, 
  Calculator, 
  CalendarClock, 
  ClipboardList, 
  CloudSunRain, 
  BookOpenCheck,
  Building2,
  HardHat
} from 'lucide-react';

export default function Sidebar({ activeView, onViewChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', epic: 'Epic 9', icon: LayoutDashboard, badge: 'Live' },
    { id: 'safety', label: 'Site Safety & PPE', epic: 'Epic 2', icon: ShieldAlert, badge: 'Vision' },
    { id: 'crack', label: 'Crack & Defect Vision', epic: 'Epic 3', icon: Activity, badge: 'Vision' },
    { id: 'valuation', label: 'Valuation & BOQ Cost', epic: 'Epic 4', icon: Calculator, badge: 'Estimator' },
    { id: 'planning', label: 'WBS & Schedule', epic: 'Epic 5', icon: CalendarClock, badge: 'Gantt' },
    { id: 'daily_log', label: 'Daily Field Assistant', epic: 'Epic 6', icon: ClipboardList, badge: 'Logs' },
    { id: 'weather', label: 'Weather Advisory', epic: 'Epic 7', icon: CloudSunRain, badge: 'Forecast' },
    { id: 'knowledge', label: 'Codes & Standards', epic: 'Epic 8', icon: BookOpenCheck, badge: 'OSHA/IBC' },
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      userSelect: 'none'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f59e0b, #b45309)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
        }}>
          <HardHat size={22} color="#0f172a" />
        </div>
        <div>
          <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            BuildIntel AI
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Multimodal Construction Platform
          </p>
        </div>
      </div>

      {/* Project Status Snippet */}
      <div style={{
        margin: '16px 14px',
        padding: '12px 14px',
        background: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Building2 size={18} color="var(--accent-amber)" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Metro Sky Tower
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
            Phase 2: Superstructure
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Intelligence Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isActive ? 'rgba(245, 158, 11, 0.4)' : 'transparent',
                background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                width: '100%',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={isActive ? 'var(--accent-amber)' : 'currentColor'} />
                <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>
                  {item.label}
                </span>
              </div>
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: isActive ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                color: isActive ? '#fbbf24' : 'var(--text-muted)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)'
              }}>
                {item.badge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>System Status:</span>
          <span style={{ color: '#34d399', fontWeight: 600 }}>FastAPI Online</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>All 9 Epics:</span>
          <span style={{ color: 'var(--text-secondary)' }}>Full Contract v1.0</span>
        </div>
      </div>
    </aside>
  );
}
