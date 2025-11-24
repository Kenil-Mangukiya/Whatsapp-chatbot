import api from '../../config/api';
import { getErrorDetails } from '../../utils/apiUtils';

/**
 * Call History API Service
 * Handles all call history-related API calls
 */

export interface CallHistoryItem {
  call_status: string | null;
  created_at: string | null;
  duration_ms: number | null;
  transcript: string | null;
  recording_url: string | null;
  disconnection_reason: string | null;
  call_summary: string | null;
  call_sentiment: string | null;
  call_successful: boolean | null;
  dynamic_variables: {
    [key: string]: any;
  } | null;
}

export interface CallHistoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CallHistoryItem[];
}

export const getCallHistory = async (): Promise<CallHistoryResponse> => {
  try {
    const response: any = await api.get('/retell/call-history');
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export default {
  getCallHistory,
};

