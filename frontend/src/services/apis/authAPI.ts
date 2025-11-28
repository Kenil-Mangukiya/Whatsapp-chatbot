import api from '../../config/api';
import { getErrorMessage, getErrorDetails } from '../../utils/apiUtils';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface RegisterGoogleUserData {
  username: string;
  email: string;
  avatar?: string;
}

export interface LoginUserData {
  email?: string;
  password?: string;
  rememberMe?: boolean;
  phoneNumber?: string;
  otp?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  accessToken: string;
}


export const registerUser = async (data: RegisterUserData) => {
  try {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    console.log("Data is : ",formData)
    
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    const response: any = await api.post('/user/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("Response is : ", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const authGoogleUser = async (data: RegisterGoogleUserData) => {
  try {
    const response: any = await api.post('/auth/google', data);
    console.log("Google authentication response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const loginUser = async (data: LoginUserData) => {
  try {
    const response: any = await api.post('/user/login', data);
    console.log("Login response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const sendOTP = async (phoneNumber: string) => {
  try {
    const response: any = await api.post('/user/send-otp', { phoneNumber });
    console.log("Send OTP response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export interface SetupData {
  businessName: string;
  fullName: string;
  email?: string;
  businessSize?: string;
  serviceArea: string;
  startTime?: string;
  endTime?: string;
  vehicleTypes?: any[];
}

export const saveSetupData = async (data: SetupData) => {
  try {
    const response: any = await api.post('/user/setup', data);
    console.log("Save setup data response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export default {
  registerUser,
  authGoogleUser,
  loginUser,
  sendOTP,
  saveSetupData,
};

