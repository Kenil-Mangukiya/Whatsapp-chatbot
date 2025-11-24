import api from '../../config/api';
import { getErrorDetails } from '../../utils/apiUtils';

/**
 * Agent API Service
 * Handles all agent-related API calls
 */

export interface AgentConfig {
  agent_name: string;
  agent_welcome_message?: string;
  webhook_url?: string | null;
  agent_type: string;
  tasks: Array<{
    task_type: string;
    tools_config: {
      llm_agent?: {
        agent_type: string;
        agent_flow_type: string;
        llm_config: {
          provider: string;
          model: string;
          temperature?: number;
          max_tokens?: number;
          [key: string]: any;
        };
      };
      synthesizer?: {
        provider: string;
        provider_config: {
          voice: string;
          engine: string;
          language: string;
          [key: string]: any;
        };
      };
      transcriber?: {
        provider: string;
        model: string;
        language: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    toolchain?: {
      execution: string;
      pipelines: string[][];
    };
    [key: string]: any;
  }>;
}

export interface AgentPrompts {
  [taskKey: string]: {
    system_prompt: string;
    [key: string]: any;
  };
}

export interface CreateAgentData {
  agent_config: AgentConfig;
  agent_prompts: AgentPrompts;
}

export interface CreateAgentResponse {
  agent_id: string;
  status: string;
}

export interface UpdateAgentData {
  agent_config: AgentConfig;
  agent_prompts: AgentPrompts;
}

export interface UpdateAgentResponse {
  agent_id: string;
  status: string;
}

export interface DeleteAgentResponse {
    message: string;
    agentId: string;
    bolnaAgentId: string;
}

export interface BolnaAgent {
    id: string;
    agent_name: string;
    agent_type: string;
    agent_status: string;
    created_at: string;
    updated_at: string;
    tasks: any[];
    ingest_source_config?: any;
    agent_prompts: any;
}

export const createAgent = async (data: CreateAgentData) => {
  try {
    const response: any = await api.post('/agent/create', data);
    console.log('Agent creation response:', response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const updateAgent = async (agentId: string, data: UpdateAgentData) => {
  try {
    const response: any = await api.put(`/agent/update/${agentId}`, data);
    console.log('Agent update response:', response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const deleteAgent = async (agentId: string) => {
  try {
    const response: any = await api.delete(`/agent/delete/${agentId}`);
    console.log('Agent deletion response:', response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const getAllAgents = async (): Promise<BolnaAgent[]> => {
  try {
    const response: any = await api.get('/agent/all');
    console.log('Get all agents response:', response);
    return response.data || [];
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const getAgentById = async (agentId?: string): Promise<any> => {
  try {
    const response: any = await api.get(`/agent/${agentId || 'dummy'}`);
    console.log('Get agent by ID response:', response);
    return response.data || {};
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export default {
  createAgent,
  updateAgent,
  deleteAgent,
  getAllAgents,
  getAgentById,
};
