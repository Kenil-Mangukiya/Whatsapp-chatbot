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
  to_number: string | null;
  from_number: string | null;
}

export interface CallHistoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CallHistoryItem[];
}

export interface DashboardStats {
  totalCalls: number;
  callsToday: number;
  totalDurationMs: number;
  sentimentCounts: {
    Positive: number;
    Negative: number;
    Neutral: number;
    Unknown: number;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardStats;
}

export const getCallHistory = async (): Promise<CallHistoryResponse> => {
  try {
    const response: any = await api.get('/retell/call-history');
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response: any = await api.get('/retell/dashboard-stats');
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export interface CallsPerDayItem {
  date: string;
  count: number;
}

export interface CallsPerDayResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CallsPerDayItem[];
}

export const getCallsPerDay = async (startDate?: string, endDate?: string): Promise<CallsPerDayResponse> => {
  try {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response: any = await api.get('/retell/calls-per-day', { params });
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export default {
  getCallHistory,
  getDashboardStats,
  getCallsPerDay,
};

