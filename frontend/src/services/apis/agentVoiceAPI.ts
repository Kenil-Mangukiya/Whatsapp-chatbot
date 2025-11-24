import api from '../../config/api';
import { getErrorDetails } from '../../utils/apiUtils';

/**
 * Agent Voice API Service
 * Handles all voice-related API calls
 */

export interface BolnaVoice {
  id: string;
  name: string;
  provider: string;
  language?: string;
  gender?: string;
  [key: string]: any;
}

/**
 * Get all available voices
 */
export const getAllVoices = async (): Promise<BolnaVoice[]> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // const response: any = await api.get('/voices/all');
    // return response.data || [];
    
    // Return empty array for now to prevent errors
    return [];
  } catch (error) {
    throw getErrorDetails(error);
  }
};

/**
 * Get user's voices
 */
export const getMyVoices = async (): Promise<BolnaVoice[]> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // const response: any = await api.get('/voices/my');
    // return response.data || [];
    
    // Return empty array for now to prevent errors
    return [];
  } catch (error) {
    throw getErrorDetails(error);
  }
};

/**
 * Add a voice
 */
export const addVoice = async (voiceData: any): Promise<BolnaVoice> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // const response: any = await api.post('/voices', voiceData);
    // return response.data;
    
    // Throw error for now since this is not implemented
    throw new Error('Add voice API not yet implemented');
  } catch (error) {
    throw getErrorDetails(error);
  }
};

/**
 * Remove a voice
 */
export const removeVoice = async (voiceId: string): Promise<void> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // await api.delete(`/voices/${voiceId}`);
    
    // Throw error for now since this is not implemented
    throw new Error('Remove voice API not yet implemented');
  } catch (error) {
    throw getErrorDetails(error);
  }
};

/**
 * Generate TTS preview
 */
export const generateTTSPreview = async (voiceId: string, text: string): Promise<string> => {
  try {
    // TODO: Implement actual API call when backend is ready
    // const response: any = await api.post('/voices/preview', { voiceId, text });
    // return response.data.audioUrl;
    
    // Throw error for now since this is not implemented
    throw new Error('TTS preview API not yet implemented');
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export default {
  getAllVoices,
  getMyVoices,
  addVoice,
  removeVoice,
  generateTTSPreview,
};

