import React, { useState, useEffect } from 'react';
import { AgentsList } from '../components/Agents/AgentList';
import { getAllAgents, type BolnaAgent } from '../services/apis/agentAPI';

interface AgentsPageProps {
  isActive: boolean;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ isActive }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${isActive ? 'block' : 'hidden'}`}>
      <AgentsList />
    </div>
  );
};

export default AgentsPage;
