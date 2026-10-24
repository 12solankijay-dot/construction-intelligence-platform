import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';

import DashboardView from './views/DashboardView';
import SafetyView from './views/SafetyView';
import CrackView from './views/CrackView';
import ValuationView from './views/ValuationView';
import PlanningView from './views/PlanningView';
import DailyLogView from './views/DailyLogView';
import WeatherView from './views/WeatherView';
import KnowledgeView from './views/KnowledgeView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            onNavigate={(view) => setActiveView(view)} 
            onOpenSettings={() => setIsSettingsOpen(true)} 
          />
        );
      case 'safety':
        return <SafetyView />;
      case 'crack':
        return <CrackView />;
      case 'valuation':
        return <ValuationView />;
      case 'planning':
        return <PlanningView />;
      case 'daily_log':
        return <DailyLogView />;
      case 'weather':
        return <WeatherView />;
      case 'knowledge':
        return <KnowledgeView />;
      default:
        return <DashboardView onNavigate={(view) => setActiveView(view)} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar across all 9 Epics */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Workspace */}
      <div className="main-content">
        <Navbar
          activeView={activeView}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        {renderView()}
      </div>

      {/* Multimodal AI Config Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
