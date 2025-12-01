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
import SetupPage from './pages/SetupPage';
import UpdateSetupPage from './pages/UpdateSetupPage';
import AdminPage from './pages/AdminPage';
import PricingSetupPage from './pages/PricingSetupPage';
import AgentSetupPage from './pages/AgentSetupPage';
import UpdateAgentSetupPage from './pages/UpdateAgentSetupPage';
import PricingPage from './pages/PricingPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import SetupRouteGuard from './components/SetupRouteGuard';
import AdminRoute from './components/AdminRoute';

function App() {
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
        <Route path="/setup" element={
          <ProtectedRoute requireSetup={false}>
            <SetupRouteGuard />
          </ProtectedRoute>
        } />
        <Route path="/update-setup" element={
          <ProtectedRoute requireSetup={false}>
            <UpdateSetupPage isActive={true} />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireSetup={false}>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/pricing-setup" element={
          <ProtectedRoute>
            <PricingSetupPage isActive={true} />
          </ProtectedRoute>
        } />
        <Route path="/agent-setup" element={<AgentSetupPage isActive={true} />} />
        <Route path="/update-agent-setup" element={
          <ProtectedRoute requireSetup={false}>
            <UpdateAgentSetupPage isActive={true} />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard-new" element={<DashboardPage isActive={true} />} />
          <Route path="dashboard" element={<DashboardNewPage isActive={true} />} />
          <Route path="agents" element={<AgentsPage isActive={true} />} />
          <Route path="voice-lab" element={<VoiceLabPage isActive={true} />} />
          <Route path="calls" element={<CallsPage isActive={true} />} />
          <Route path="analytics" element={<AnalyticsPage isActive={true} />} />
          <Route path="crm" element={<CRMPage isActive={true} />} />
          <Route path="invoicing" element={<InvoicingPage isActive={true} />} />
          <Route path="settings" element={<SettingsPage isActive={true} />} />
          <Route path="team" element={<TeamPage isActive={true} />} />
          <Route path="support" element={<SupportPage isActive={true} />} />
          <Route path="pricing" element={<PricingPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

