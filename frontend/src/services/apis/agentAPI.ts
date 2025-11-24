import api from '../../config/api';
import { getErrorDetails } from '../../utils/apiUtils';

/**
 * Agent API Service
 * Handles all agent-related API calls
 */

export interface BolnaAgent {
  id: string;
  name: string;
  useCase: string;
  status: 'active' | 'inactive';
  [key: string]: any;
}

/**
 * Get all agents
 */
export const getAllAgents = async (): Promise<BolnaAgent[]> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // const response: any = await api.get('/agents');
    // return response.data || [];
    
    // Return empty array for now to prevent errors
    return [];
  } catch (error) {
    throw getErrorDetails(error);
  }
};

/**
 * Get agent by ID
 */
export const getAgentById = async (id?: string): Promise<BolnaAgent | null> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // const response: any = await api.get(`/agents/${id}`);
    // return response.data || null;
    
    // Return null for now to prevent errors
    return null;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

/**
 * Create a new agent
 */
export const createAgent = async (agentData: any): Promise<BolnaAgent> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // const response: any = await api.post('/agents', agentData);
    // return response.data;
    
    // Throw error for now since this is not implemented
    throw new Error('Agent creation API not yet implemented');
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export default {
  getAllAgents,
  getAgentById,
  createAgent,
};

