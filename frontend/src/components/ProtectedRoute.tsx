import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../config/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to make an authenticated request to verify token
        // You can create a simple endpoint like /user/me or use any protected endpoint
        // For now, we'll check if cookie exists and is valid by trying to access a protected resource
        const response = await api.get('/user/me');
        
        if (response) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error: any) {
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
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


