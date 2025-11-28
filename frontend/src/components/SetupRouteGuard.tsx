import React, { useEffect, useState, useRef } from 'react';
import api from '../config/api';
import { checkSetupStatus } from '../utils/setupUtils';
import SetupPage from '../pages/SetupPage';

const SetupRouteGuard: React.FC = () => {
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  // First useEffect - check setup status
  useEffect(() => {
    // Prevent multiple checks
    if (hasCheckedRef.current) {
      return;
    }

    const checkSetup = async () => {
      hasCheckedRef.current = true;
      
      try {
        const response: any = await api.get('/user/me');
        console.log('SetupRouteGuard - User response:', response);
        
        // Handle axios interceptor response structure (returns response.data directly)
        const user = response?.data?.user || response?.user;
        const setupCompleted = response?.data?.setupCompleted !== undefined 
          ? response?.data?.setupCompleted 
          : response?.setupCompleted;
        
        console.log('SetupRouteGuard - Extracted user:', user);
        console.log('SetupRouteGuard - Extracted setupCompleted:', setupCompleted);
        
        if (user) {
          // Use setupCompleted flag if available, otherwise check manually
          const isSetupComplete = setupCompleted !== undefined 
            ? setupCompleted 
            : checkSetupStatus(user);
          console.log('SetupRouteGuard - Final setup status:', isSetupComplete);
          setSetupCompleted(isSetupComplete);
        } else {
          console.log('SetupRouteGuard - No user found, setting setupCompleted to false');
          setSetupCompleted(false);
        }
      } catch (error: any) {
        console.error('SetupRouteGuard - Error checking setup status:', error);
        // If auth error, user will be redirected by ProtectedRoute
        // Otherwise, assume setup not completed
        if (error?.status === 401 || error?.response?.status === 401) {
          // Auth error - will be handled by ProtectedRoute
          setSetupCompleted(null);
        } else {
          setSetupCompleted(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkSetup();
  }, []);

  // Second useEffect - handle navigation when setup is completed
  useEffect(() => {
    if (setupCompleted && !hasNavigatedRef.current && !loading) {
      hasNavigatedRef.current = true;
      console.log('SetupRouteGuard - Redirecting to dashboard via window.location');
      // Use window.location for hard navigation to prevent loops
      window.location.href = '/dashboard';
    }
  }, [setupCompleted, loading]);

  // If setup is already completed and navigating, show loading
  if (setupCompleted && hasNavigatedRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If setup is not completed, show setup page
  if (setupCompleted === false) {
    return <SetupPage isActive={true} />;
  }

  // Still loading or null, show loading
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default SetupRouteGuard;

