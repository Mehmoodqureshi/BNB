/**
 * Authentication Service
 * Unified authentication for all user roles (agency, agent, user)
 */

import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stagingbackend.dalile.com';

// Token storage keys
const TOKEN_KEY = 'auth_token';

/**
 * User roles in the system
 */
export type UserRole = 'agency' | 'agent' | 'bnbuser';

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * API response from login
 */
export interface AuthResponse {
  access_token: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  isActive: boolean;
  agent?: any;
}

/**
 * Decoded user information from token
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Token Management
 */
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  exists: (): boolean => {
    return !!tokenStorage.get();
  },
};

/**
 * Decode JWT token to get user information
 */
export const decodeToken = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    
    return {
      id: payload.sub?.toString() || payload.id?.toString() || '',
      email: payload.email || payload.username || '',
      name: payload.name || '',
      role: payload.role as UserRole,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get current authenticated user from token
 */
export const getCurrentUser = (): AuthUser | null => {
  const token = tokenStorage.get();
  if (!token) return null;
  return decodeToken(token);
};

/**
 * Login API call
 */
export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  console.log('🔵 Auth Request:', `${API_URL}/auth/login`);
  console.log('📧 Email:', credentials.email);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Authentication failed');
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 Success:', { role: data.role, email: data.email });

  return data;
};

/**
 * Logout - clear token and user data
 */
export const logout = (): void => {
  tokenStorage.remove();
  console.log('✅ Logged out successfully');
};

/**
 * Check if user has specific role
 */
export const hasRole = (requiredRole: UserRole): boolean => {
  const user = getCurrentUser();
  return user?.role === requiredRole;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = tokenStorage.get();
  if (!token) return false;

  const user = decodeToken(token);
  return !!user;
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): string | null => {
  const token = tokenStorage.get();
  return token ? `Bearer ${token}` : null;
};

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Save token
      tokenStorage.set(data.access_token);
      console.log('💾 Token saved');
      console.log('👤 User:', data.name, `(${data.role})`);
    },
    onError: (error: Error) => {
      console.error('❌ Login failed:', error.message);
    },
  });
};

/**
 * Hook for logout
 */
export const useLogout = () => {
  return () => {
    logout();
    window.location.href = '/';
  };
};

