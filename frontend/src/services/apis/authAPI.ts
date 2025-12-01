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

export const logoutUser = async () => {
  try {
    const response: any = await api.post('/user/logout');
    console.log("Logout response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export interface BusinessData {
  id: number;
  businessName: string;
  phoneNumber: string;
  fullName: string;
  email: string | null;
  businessSize: string | null;
  serviceArea: string | null;
  startTime: string | null;
  endTime: string | null;
  vehicleTypes: any[] | null;
  createdAt: string;
  updatedAt: string;
  assignedPhoneNumber?: string | null;
  role?: 'user' | 'admin';
  agentSetup?: AgentSetupData | null;
}

export const getAllBusinesses = async (): Promise<{ data: BusinessData[] }> => {
  try {
    const response: any = await api.get('/user/businesses');
    console.log("Get businesses response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export interface AssignPhoneData {
  businessId: number;
  phoneNumber: string;
}

export interface RemovePhoneData {
  businessId: number;
}

export interface ChangeRoleData {
  businessId: number;
  newRole: 'user' | 'admin';
}

export const assignPhoneNumber = async (data: AssignPhoneData) => {
  try {
    const response: any = await api.post('/user/assign-phone', data);
    console.log("Assign phone number response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const removePhoneNumber = async (data: RemovePhoneData) => {
  try {
    const response: any = await api.post('/user/remove-phone', data);
    console.log("Remove phone number response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const changeUserRole = async (data: ChangeRoleData) => {
  try {
    const response: any = await api.post('/user/change-role', data);
    console.log("Change user role response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export interface AgentSetupData {
  id?: number;
  agentName?: string | null;
  agentVoice?: 'male' | 'female' | null;
  agentLanguage?: string | null;
  welcomeMessage?: string | null;
  agentFlow?: string | null;
  customerDetails?: string | null;
  transferCall?: string | null;
  endingMessage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const saveAgentSetup = async (data: AgentSetupData) => {
  try {
    const response: any = await api.post('/user/agent-setup', data);
    console.log("Save agent setup response:", response);
    return response;
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export const getAgentSetup = async (): Promise<{ data: AgentSetupData | null }> => {
  try {
    const response: any = await api.get('/user/me');
    const user = response?.data?.user || response?.user;
    const agentSetup = user?.agentSetup || null;
    return { data: agentSetup };
  } catch (error) {
    throw getErrorDetails(error);
  }
};

export interface AdminLoginAsUserData {
  userId: number;
}

export const adminLoginAsUser = async (data: AdminLoginAsUserData) => {
  try {
    const response: any = await api.post('/user/admin/login-as-user', data);
    console.log("Admin login as user response:", response);
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
  logoutUser,
  getAllBusinesses,
  assignPhoneNumber,
  removePhoneNumber,
  changeUserRole,
  saveAgentSetup,
  getAgentSetup,
};

