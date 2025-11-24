/**
 * API Utility Functions
 * Helper functions for consistent API error handling and response formatting
 */

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: any[];
  data?: any;
}

/**
 * Extract error message from various error formats
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0];
  }

  return 'An unexpected error occurred';
};

/**
 * Extract error details for display
 */
export const getErrorDetails = (error: any): ApiError => {
  const status = error?.status || error?.response?.status || 0;
  const message = getErrorMessage(error);
  const errors = error?.response?.data?.errors || error?.errors || [];
  const data = error?.response?.data || error?.data;

  return {
    status,
    message,
    errors,
    data,
  };
};

/**
 * Check if response is successful
 */
export const isSuccessResponse = (response: any): boolean => {
  return response?.success === true || response?.statusCode >= 200 && response?.statusCode < 300;
};

/**
 * Create a standardized success response
 */
export const createSuccessResponse = <T>(data: T, message = 'Success'): ApiResponse<T> => {
  return {
    success: true,
    statusCode: 200,
    message,
    data,
  };
};

/**
 * Create a standardized error response
 */
export const createErrorResponse = (message: string, statusCode = 400): ApiResponse<null> => {
  return {
    success: false,
    statusCode,
    message,
    data: null,
  };
};

