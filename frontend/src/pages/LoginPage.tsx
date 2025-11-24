import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import { loginUser, LoginUserData, sendOTP } from '../services/apis/authAPI';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [isPhoneValidated, setIsPhoneValidated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

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

  // Extract OTP from WhatsApp response
  const extractOTPFromResponse = (response: any): string | null => {
    try {
      // OTP is in: newMessage.message.components[0].text
      // Format: "*647113* is your verification code."
      const text = response?.data?.newMessage?.message?.components?.[0]?.text;
      if (!text) {
        return null;
      }
      
      // Extract OTP between asterisks: *647113*
      const otpMatch = text.match(/\*(\d+)\*/);
      if (otpMatch && otpMatch[1]) {
        return otpMatch[1];
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting OTP:', error);
      return null;
    }
  };

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
      const response = await sendOTP(formattedPhoneNumber);
      const extractedOtp = extractOTPFromResponse(response);
      
      if (extractedOtp) {
        setSentOtp(extractedOtp);
        setIsPhoneValidated(true);
        toast.success('OTP sent successfully! Please check your WhatsApp.');
      } else {
        toast.error('Failed to extract OTP from response. Please try again.');
        console.error('Could not extract OTP from response:', response);
      }
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

    // Validate OTP against sent OTP
    if (!sentOtp) {
      newErrors.otp = 'OTP not found. Please request a new OTP.';
      setErrors(newErrors);
      return;
    }

    if (otp !== sentOtp) {
      newErrors.otp = 'Invalid OTP. Please check and try again.';
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
        
        console.log('Login successful:', response);
        toast.success(response.message || 'Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#FFFFFF" opacity="0.2"/>
                <path d="M20 10L26 16L20 22L14 16L20 10Z" fill="#FFFFFF"/>
                <circle cx="20" cy="20" r="4" fill="#FFFFFF"/>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your RoadAI Assistant account</p>
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
                    className={`pl-3 appearance-none relative block w-full py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors ${
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
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingOtp ? 'Sending OTP...' : 'Confirm'}
                  </button>
                </div>
              </div>
            ) : (
              /* OTP Input */
              <div>
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
                    className={`pl-3 appearance-none relative block w-full py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors text-center text-2xl tracking-widest ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000000"
                    required
                  />
                </div>
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                )}
                
                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
