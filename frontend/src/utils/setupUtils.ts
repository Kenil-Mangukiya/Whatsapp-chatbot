/**
 * Utility functions for checking user setup status
 */

export interface UserSetupStatus {
  setupCompleted: boolean;
  user?: {
    id: number;
    businessName?: string;
    fullName?: string;
    serviceArea?: string;
  };
}

/**
 * Check if user has completed setup
 * Setup is considered complete if user has: businessName, fullName, and serviceArea
 */
export const checkSetupStatus = (user: any): boolean => {
  if (!user) return false;
  return !!(user.businessName && user.fullName && user.serviceArea);
};




