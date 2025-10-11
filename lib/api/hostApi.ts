/**
 * Host API Service
 * API calls for host/agent functionality
 */

import { hostToken } from '@/lib/utils/tokenStorage';

// Your backend API URL
const API_URL = process.env.NEXT_PUBLIC_END_POINT || 'https://stagingbackend.dalile.com';

// Types
export interface HostLoginRequest {
  email: string;
  password: string;
}

export interface HostLoginResponse {
  access_token: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  agent: any;
}

// Host/Agent Login API Call
export const hostLogin = async (credentials: HostLoginRequest): Promise<HostLoginResponse> => {
  // 📤 Console what we're sending
  const requestData = {
    email: credentials.email,
    password: credentials.password,
  };
  
  console.log('🔵 Host API Request URL:', `${API_URL}/auth/login`);
  console.log('🔵 Host Request Data:', requestData);
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  console.log('🔵 Host Response Status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json();
    console.log('🔴 Host Error Response:', error);
    throw new Error(error.message || 'Login failed');
  }

  const responseData = await response.json();
  console.log('🟢 Host Success Response:', responseData);
  
  return responseData;
};

