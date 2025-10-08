/**
 * API Client with Token Management
 * Automatically adds authentication headers
 */

import { adminToken, hostToken } from '@/lib/utils/tokenStorage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stagingbackend.dalile.com';

export type UserType = 'admin' | 'host' | 'guest';

/**
 * Generic API request with automatic token handling
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  userType: UserType = 'guest'
): Promise<T> => {
  // Get token based on user type
  let token: string | null = null;
  if (userType === 'admin') {
    token = adminToken.get();
  } else if (userType === 'host') {
    token = hostToken.get();
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with options headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const url = `${API_URL}${endpoint}`;
  
  console.log(`🔵 API Request [${userType}]:`, options.method || 'GET', url);
  
  const response = await fetch(url, config);

  console.log(`🔵 Response Status:`, response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json();
    console.log('🔴 Error Response:', error);
    throw new Error(error.message || 'Request failed');
  }

  const data = await response.json();
  console.log('🟢 Success Response:', data);
  
  return data;
};

/**
 * Convenience methods
 */
export const api = {
  // GET request
  get: <T>(endpoint: string, userType: UserType = 'guest') => 
    apiRequest<T>(endpoint, { method: 'GET' }, userType),

  // POST request
  post: <T>(endpoint: string, body: any, userType: UserType = 'guest') =>
    apiRequest<T>(
      endpoint,
      { method: 'POST', body: JSON.stringify(body) },
      userType
    ),

  // PUT request
  put: <T>(endpoint: string, body: any, userType: UserType = 'guest') =>
    apiRequest<T>(
      endpoint,
      { method: 'PUT', body: JSON.stringify(body) },
      userType
    ),

  // DELETE request
  delete: <T>(endpoint: string, userType: UserType = 'guest') =>
    apiRequest<T>(endpoint, { method: 'DELETE' }, userType),

  // PATCH request
  patch: <T>(endpoint: string, body: any, userType: UserType = 'guest') =>
    apiRequest<T>(
      endpoint,
      { method: 'PATCH', body: JSON.stringify(body) },
      userType
    ),
};

