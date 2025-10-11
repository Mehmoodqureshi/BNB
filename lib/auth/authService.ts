/**
 * Authentication Service
 * Unified authentication for all user roles (agency, agent, user)
 */

import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_END_POINT;

// Token storage keys
const TOKEN_KEY = 'bnbuser';

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
  access_token?: string;
  id?: number;
  name?: string;
  email?: string;
  role?: UserRole;
  status?: string;
  isActive?: boolean;
  agent?: any;
  // OTP Verification response fields
  message?: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
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
    
    // Check if token is expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        console.log('🔴 Token expired');
        return null;
      }
    }
    
    // Extract user info from payload
    // Handle both userId and id fields, and bnb_user/bnbuser role variants
    const userId = payload.userId?.toString() || payload.sub?.toString() || payload.id?.toString() || '';
    const userRole = payload.role === 'bnb_user' ? 'bnbuser' : payload.role;
    
    return {
      id: userId,
      email: payload.email || '',
      name: payload.name || '',
      role: userRole as UserRole,
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
 * Registration data
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Register API call
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  console.log('🔵 Register Request:', `${API_URL}/bnb-users/register`);
  console.log('📧 Email:', userData.email);

  const response = await fetch(`${API_URL}/bnb-users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Registration failed');
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 Registration Success:', { role: data.role, email: data.email });

  return data;
};

/**
 * Verify OTP API call
 */
export const verifyOTP = async (email: string, otp: string): Promise<AuthResponse> => {
  console.log('🔵 OTP Verification Request:', `${API_URL}/bnb-users/verify-otp`);
  console.log('📧 Email:', email);

  const response = await fetch(`${API_URL}/bnb-users/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'OTP verification failed');
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 OTP Verification Success');

  return data;
};

/**
 * Resend OTP API call
 */
export const resendOTP = async (email: string): Promise<void> => {
  console.log('🔵 Resend OTP Request:', `${API_URL}/bnb-users/resend-otp`);
  console.log('📧 Email:', email);

  const response = await fetch(`${API_URL}/bnb-users/resend-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Failed to resend OTP');
  }

  console.log('🟢 OTP Resent Successfully');
};

/**
 * Get user profile from API
 */
export const getUserProfile = async (): Promise<any> => {
  const token = tokenStorage.get();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('🔵 Get Profile Request:', `${API_URL}/bnb-users/profile`);

  const response = await fetch(`${API_URL}/bnb-users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      tokenStorage.remove();
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Failed to fetch profile');
  }

  const data = await response.json();
  console.log('🟢 Profile fetched successfully:', data);
  
  return data;
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
 * Hook for registration mutation
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      console.log('✅ Registration successful!', data);
    },
    onError: (error: Error) => {
      console.error('❌ Registration failed:', error.message);
    },
  });
};

/**
 * Hook for OTP verification mutation
 */
export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => 
      verifyOTP(email, otp),
    onSuccess: (data) => {
      console.log('📦 OTP Verification Response:', data);
      // Store the token in localStorage as 'bnbuser'
      const token = data.token || data.access_token;
      if (token) {
        tokenStorage.set(token);
        console.log('✅ Token stored in localStorage as "bnbuser"');
        console.log('🔐 Token expires in 30 days');
      }
    },
    onError: (error: Error) => {
      console.error('❌ OTP verification failed:', error.message);
    },
  });
};

/**
 * Hook for resend OTP mutation
 */
export const useResendOTP = () => {
  return useMutation({
    mutationFn: (email: string) => resendOTP(email),
    onSuccess: () => {
      console.log('✅ OTP resent successfully');
    },
    onError: (error: Error) => {
      console.error('❌ Failed to resend OTP:', error.message);
    },
  });
};

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Save token
      if (data.access_token) {
        tokenStorage.set(data.access_token);
        console.log('💾 Token saved');
      }
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

/**
 * Hook to fetch user profile using TanStack Query
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

