import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import { loginUser, LoginUserData, sendOTP } from '../services/apis/authAPI';
import toast from 'react-hot-toast';
import api from '../config/api';
import { checkSetupStatus } from '../utils/setupUtils';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isPhoneValidated, setIsPhoneValidated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds (300 seconds)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse: any = await api.get('/user/me');
        const user = userResponse?.data?.user || userResponse?.user;
        const setupCompleted = userResponse?.data?.setupCompleted !== undefined 
          ? userResponse?.data?.setupCompleted 
          : userResponse?.setupCompleted;
        
        if (user) {
          // User is authenticated, redirect based on setup status
          const isSetupComplete = setupCompleted !== undefined 
            ? setupCompleted 
            : checkSetupStatus(user);
          
          if (isSetupComplete) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/setup', { replace: true });
          }
        }
      } catch (error) {
        // User is not authenticated, stay on login page
        console.log('User not authenticated, showing login page');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Format phone number - add 91 if not present
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // If phone number doesn't start with 91, add it
    if (!cleanedPhone.startsWith('91')) {
      return '91' + cleanedPhone;
    }
    
    return cleanedPhone;
  };

  // Validate phone number
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Check if phone number is valid (10-15 digits, can start with country code)
    // Common formats: +1234567890, 1234567890, etc.
    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      return false;
    }
    
    return true;
  };

  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    // Clear error when user starts typing
    if (errors.phoneNumber) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: ''
      }));
    }
  };

  // Handle OTP input change (only digits, max 6)
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: ''
      }));
    }
  };

  // Format timer as MM:SS
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer countdown
  const startTimer = () => {
    setTimer(300); // Reset to 5 minutes
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle confirm button click - validate phone number and send OTP
  const handleConfirmPhone = async () => {
    const newErrors: Record<string, string> = {};

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      setErrors(newErrors);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number (10-15 digits)';
      setErrors(newErrors);
      return;
    }

    // Format phone number - add 91 if not present
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Phone number is valid, send OTP
    setErrors({});
    setSendingOtp(true);
    
    try {
      await sendOTP(formattedPhoneNumber);
      setIsPhoneValidated(true);
      startTimer(); // Start the 5-minute timer
      toast.success('OTP sent successfully! Please check your WhatsApp.');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      const errorMessage = error?.response?.data?.message 
        || error?.data?.message 
        || error?.message 
        || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    // Clear previous OTP input
    setOtp('');
    setErrors({});
    
    // Format phone number
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    
    // Resend OTP
    setSendingOtp(true);
    try {
      await sendOTP(formattedPhoneNumber);
      startTimer(); // Restart the 5-minute timer
      toast.success('OTP resent successfully! Please check your WhatsApp.');
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      const errorMessage = error?.response?.data?.message 
        || error?.data?.message 
        || error?.message 
        || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle back to phone number field
  const handleBackToPhone = () => {
    setIsPhoneValidated(false);
    setOtp('');
    setErrors({});
    // Stop timer if running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(300); // Reset timer
  };

  // Handle OTP submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!otp || otp.length !== 6) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Format phone number - add 91 if not present
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        
        const loginData: LoginUserData = {
          phoneNumber: formattedPhoneNumber,
          otp: otp
        };
        const response = await loginUser(loginData);
        
        console.log('Login successful - full response:', response);
        const message = response?.data?.message || response?.message || 'Login successful!';
        toast.success(message);
        
        // Wait a bit for cookie to be set, then check setup status
        // Use a longer timeout to ensure cookie is properly set
        setTimeout(async () => {
          try {
            console.log('Checking user setup status...');
            const userResponse: any = await api.get('/user/me');
            console.log('User response from /user/me:', userResponse);
            
            // Handle different response structures (axios interceptor returns response.data)
            // So userResponse is already the data object
            const user = userResponse?.data?.user || userResponse?.user;
            const setupCompleted = userResponse?.data?.setupCompleted !== undefined 
              ? userResponse?.data?.setupCompleted 
              : userResponse?.setupCompleted;
            const userRole = user?.role || 'user';
            
            console.log('Extracted user data:', user);
            console.log('Extracted setupCompleted flag:', setupCompleted);
            console.log('Extracted user role:', userRole);
            
            // Check if user is admin
            if (userRole === 'admin') {
              console.log('✅ Admin user - Navigating to admin page');
              navigate('/admin', { replace: true });
              return;
            }
            
            // For regular users, check setup status
            let isSetupComplete = false;
            if (setupCompleted !== undefined) {
              isSetupComplete = setupCompleted;
            } else if (user) {
              isSetupComplete = checkSetupStatus(user);
            }
            
            console.log('Final setup status check - isSetupComplete:', isSetupComplete);
            
            // Navigate based on setup status
            if (isSetupComplete) {
              console.log('✅ Setup complete - Navigating to dashboard');
              navigate('/dashboard', { replace: true });
            } else {
              console.log('⚠️ Setup incomplete - Navigating to setup page');
              navigate('/setup', { replace: true });
            }
          } catch (error: any) {
            // If can't check setup, default to setup page for safety
            console.error('❌ Error checking setup status:', error);
            console.log('⚠️ Defaulting to setup page due to error');
            navigate('/setup', { replace: true });
          }
        }, 1500); // 1.5 seconds to ensure cookie is set
      } catch (error: any) {
        console.error('Login error:', error);
        // Extract error message from various possible structures
        const errorMessage = error?.response?.data?.message 
          || error?.data?.message 
          || error?.message 
          || 'Login failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };


  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/public/Untitled-2-04.webp"
              alt="RoadAI Assistant"
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in or create your RoadAI Assistant account</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Phone Number */}
            {!isPhoneValidated ? (
              <div>
                <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className={`pl-3 appearance-none relative block w-full py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
                
                {/* Confirm Button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleConfirmPhone}
                    disabled={loading || sendingOtp}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingOtp ? 'Sending OTP...' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              /* OTP Input */
              <div>
                {/* Back to Phone Number Button */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    disabled={loading || sendingOtp}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Edit Phone Number
                  </button>
                </div>
                
                <label htmlFor="otp" className="block text-lg font-medium text-gray-700 mb-2">
                  Enter 6-Digit OTP <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    className={`pl-3 appearance-none relative block w-full py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors text-center text-2xl tracking-widest ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000000"
                    required
                  />
                </div>
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                )}
                
                {/* Timer and Resend Section */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">OTP expires in:</span>
                    <span className={`text-sm font-semibold ${timer <= 60 ? 'text-red-600' : 'text-red-600'}`}>
                      {formatTimer(timer)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={sendingOtp}
                    className="text-sm font-medium text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
                
                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
