import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../config/api';
import { checkSetupStatus } from '../utils/setupUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSetup?: boolean; // If true, redirect to setup if incomplete
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireSetup = true }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: any = await api.get('/user/me');
        console.log('ProtectedRoute - User response:', response);
        
        // Handle axios interceptor response structure (returns response.data directly)
        const user = response?.data?.user || response?.user;
        const setupCompleted = response?.data?.setupCompleted !== undefined 
          ? response?.data?.setupCompleted 
          : response?.setupCompleted;
        
        console.log('ProtectedRoute - Extracted user:', user);
        console.log('ProtectedRoute - Extracted setupCompleted:', setupCompleted);
        
        if (user) {
          setIsAuthenticated(true);
          // Use setupCompleted flag if available, otherwise check manually
          const isSetupComplete = setupCompleted !== undefined 
            ? setupCompleted 
            : checkSetupStatus(user);
          console.log('ProtectedRoute - Final setup status:', isSetupComplete);
          setSetupCompleted(isSetupComplete);
        } else {
          console.log('ProtectedRoute - No user found, setting authenticated to false');
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error('ProtectedRoute - Auth check error:', error);
        // If request fails with 401, user is not authenticated
        if (error?.status === 401 || error?.response?.status === 401) {
          setIsAuthenticated(false);
        } else {
          // For other errors, assume not authenticated to be safe
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If setup is required and not completed, redirect to setup
  if (requireSetup && !setupCompleted) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
