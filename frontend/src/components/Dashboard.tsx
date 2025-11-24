import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DashboardPage from '../pages/DashboardPage';
import AgentsPage from '../pages/AgentsPage';
import VoiceLabPage from '../pages/VoiceLabPage';
import CallsPage from '../pages/CallsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import CRMPage from '../pages/CRMPage';
import InvoicingPage from '../pages/InvoicingPage';
import SettingsPage from '../pages/SettingsPage';
import TeamPage from '../pages/TeamPage';
import SupportPage from '../pages/SupportPage';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage isActive={true} />;
      case 'agents':
        return <AgentsPage isActive={true} />;
      case 'voice-lab':
        return <VoiceLabPage isActive={true} />;
      case 'calls':
        return <CallsPage isActive={true} />;
      case 'analytics':
        return <AnalyticsPage isActive={true} />;
      case 'crm':
        return <CRMPage isActive={true} />;
      case 'invoicing':
        return <InvoicingPage isActive={true} />;
      case 'settings':
        return <SettingsPage isActive={true} />;
      case 'team':
        return <TeamPage isActive={true} />;
      case 'support':
        return <SupportPage isActive={true} />;
      default:
        return <DashboardPage isActive={true} />;
    }
  };

  return (
    <div className="App">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

