import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import VoiceLabPage from './pages/VoiceLabPage';
import CallsPage from './pages/CallsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CRMPage from './pages/CRMPage';
import InvoicingPage from './pages/InvoicingPage';
import SettingsPage from './pages/SettingsPage';
import TeamPage from './pages/TeamPage';
import SupportPage from './pages/SupportPage';
import DashboardNewPage from './pages/DashboardNewPage';

function App() {
  // For now, we'll use a simple approach without authentication context
  // In production, you'd want to use Context API or Redux for auth state
  
  return (
    <Router>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              background: '#ffffff',
              color: '#000000',
              border: '1px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fee2e2',
            },
          },
          duration: 4000,
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage isActive={true} />} />
          <Route path="dashboard-new" element={<DashboardNewPage isActive={true} />} />
          <Route path="agents" element={<AgentsPage isActive={true} />} />
          <Route path="voice-lab" element={<VoiceLabPage isActive={true} />} />
          <Route path="calls" element={<CallsPage isActive={true} />} />
          <Route path="analytics" element={<AnalyticsPage isActive={true} />} />
          <Route path="crm" element={<CRMPage isActive={true} />} />
          <Route path="invoicing" element={<InvoicingPage isActive={true} />} />
          <Route path="settings" element={<SettingsPage isActive={true} />} />
          <Route path="team" element={<TeamPage isActive={true} />} />
          <Route path="support" element={<SupportPage isActive={true} />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

