/**
 * Admin API Service
 * Simple API calls for admin functionality
 */

import { adminToken } from '@/lib/utils/tokenStorage';

// Your backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stagingbackend.dalile.com';

// Types
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  agent: any;
}

// Admin Login API Call
export const adminLogin = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
  // 📤 Console what we're sending
  const requestData = {
    email: credentials.email,
    password: credentials.password,
  };
  
  console.log('🔵 API Request URL:', `${API_URL}/auth/login`);
  console.log('🔵 Request Data:', requestData);
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  console.log('🔵 Response Status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json();
    console.log('🔴 Error Response:', error);
    throw new Error(error.message || 'Login failed');
  }

  const responseData = await response.json();
  console.log('🟢 Success Response:', responseData);
  
  return responseData;
};

