import api from '../../config/api';
import { getErrorDetails } from '../../utils/apiUtils';

/**
 * Voice API Service
 * Handles all voice-related API calls
 */

export interface BolnaVoice {
  id: string;
  voice_id: string;
  provider: string;
  name: string;
  model: string;
  accent: string;
  language_code?: string; // Language code for providers like Polly
  agentVoiceId?: string; // Our internal ID from database
}

// Get all voices from our database (much faster than Bolna API)
export const getAllVoices = async (): Promise<BolnaVoice[]> => {
  try {
    const response: any = await api.get('/voice/all');
    
    // Check if response has the nested data property and it's an array
    if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
      // Transform the data to match our interface
      // Database returns: { id, bolnaVoiceId, provider, name, model, voice_id, accent, language_code }
      // Frontend expects: { id: bolnaVoiceId, agentVoiceId: id, voice_id, provider, name, model, accent, language_code }
      return response.data.data.map((voice: any) => ({
        id: voice.bolnaVoiceId,
        agentVoiceId: voice.id,
        voice_id: voice.voice_id,
        provider: voice.provider,
        name: voice.name,
        model: voice.model,
        accent: voice.accent,
        language_code: voice.language_code,
      }));
    }
    
    // Return empty array if data is not available or not an array
    return [];
  } catch (error) {
    throw getErrorDetails(error);
  }
};

// Import all voices from Bolna AI into our database (one-time operation)
export const importAllVoices = async (): Promise<any> => {
  try {
    const response: any = await api.post('/voice/import');
    return response.data;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

// Get user's selected voices
export const getMyVoices = async (): Promise<BolnaVoice[]> => {
  try {
    const response: any = await api.get('/voice/my-voices');
    
    if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    throw getErrorDetails(error);
  }
};

// Add a voice to user's collection
export const addVoice = async (agentVoiceId: string): Promise<any> => {
  try {
    const response: any = await api.post('/voice/add', { agentVoiceId });
    return response.data;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

// Remove a voice from user's collection
export const removeVoice = async (agentVoiceId: string): Promise<any> => {
  try {
    const response: any = await api.delete(`/voice/remove/${agentVoiceId}`);
    return response.data;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

// Generate TTS audio preview
export const generateTTSPreview = async (provider: string, provider_config: any, text: string): Promise<Blob> => {
  try {
    const response: any = await api.post('/voice/preview', {
      provider,
      provider_config,
      text
    }, {
      responseType: 'blob' // Important: Handle binary audio data
    });
    return response as unknown as Blob;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export default {
  getAllVoices,
  importAllVoices,
  getMyVoices,
  addVoice,
  removeVoice,
  generateTTSPreview,
};
