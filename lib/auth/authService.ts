/**
 * Authentication Service
 * Unified authentication for all user roles (agency, agent, user)
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { setTokenByRole, removeTokenByRole } from '@/lib/utils/tokenStorage';

const API_URL = process.env.NEXT_PUBLIC_END_POINT ;

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
    // This function is deprecated - use role-specific token checks instead
    return false;
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
  // This function is deprecated - use role-specific token checks instead
  // Try to find any valid token across all roles
  const { adminToken, hostToken, userToken } = require('@/lib/utils/tokenStorage');
  
  const tokens = [
    { token: adminToken.get(), role: 'agency' },
    { token: hostToken.get(), role: 'agent' },
    { token: userToken.get(), role: 'bnbuser' }
  ];
  
  for (const { token, role } of tokens) {
    if (token) {
      const user = decodeToken(token);
      if (user && user.role === role) {
        return user;
      }
    }
  }
  
  return null;
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
  const { userToken } = require('@/lib/utils/tokenStorage');
  const token = userToken.get();
  
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
      const { userToken } = require('@/lib/utils/tokenStorage');
      userToken.remove();
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Failed to fetch profile');
  }

  const result = await response.json();
  console.log('🟢 Profile fetched successfully:', result);
  
  // Return the data object from the response
  return result.data || result;
};

/**
 * Update user profile data with FormData (supports firstName, lastName, avatar file)
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  avatar?: File;
}

export const updateProfile = async (profileData: UpdateProfileData): Promise<any> => {
  const { userToken } = require('@/lib/utils/tokenStorage');
  const token = userToken.get();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('🔵 Update Profile Request:', `${API_URL}/bnb-users/updateProfile`);
  console.log('📝 Data:', profileData);

  // Create FormData
  const formData = new FormData();
  
  if (profileData.firstName) {
    formData.append('firstName', profileData.firstName);
  }
  if (profileData.lastName) {
    formData.append('lastName', profileData.lastName);
  }
  if (profileData.avatar) {
    formData.append('avatar', profileData.avatar);
  }

  const response = await fetch(`${API_URL}/bnb-users/updateProfile`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    if (response.status === 401) {
      const { userToken } = require('@/lib/utils/tokenStorage');
      userToken.remove();
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }

  const data = await response.json();
  console.log('🟢 Profile updated successfully:', data);
  
  return data;
};

/**
 * Login API call (for admin/agent with password)
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
 * Login API call for BNB users (passwordless, sends OTP)
 */
export const loginBnbUser = async (email: string): Promise<AuthResponse> => {
  console.log('🔵 BNB User Login Request:', `${API_URL}/bnb-users/login`);
  console.log('📧 Email:', email);

  const response = await fetch(`${API_URL}/bnb-users/login`, {
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
    throw new Error(error.message || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 BNB User Login Success - OTP sent to:', email);

  return data;
};

/**
 * Logout - clear token and user data
 */
export const logout = (): void => {
  const { clearAllTokens } = require('@/lib/utils/tokenStorage');
  clearAllTokens();
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
  const user = getCurrentUser();
  return !!user;
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): string | null => {
  const user = getCurrentUser();
  if (!user) return null;
  
  const { getCurrentToken } = require('@/lib/utils/tokenStorage');
  const token = getCurrentToken(user.role);
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
      // Store the token in user storage
      const token = data.token || data.access_token;
      if (token) {
        setTokenByRole(token, 'bnbuser');
        console.log('✅ Token stored in localStorage as "userToken"');
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
 * Hook for login mutation (admin/agent)
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Save token based on role
      if (data.access_token && data.role) {
        setTokenByRole(data.access_token, data.role);
        console.log('💾 Token saved for role:', data.role);
      }
      console.log('👤 User:', data.name, `(${data.role})`);
    },
    onError: (error: Error) => {
      console.error('❌ Login failed:', error.message);
    },
  });
};

/**
 * Hook for BNB user login mutation (sends OTP)
 */
export const useLoginBnbUser = () => {
  return useMutation({
    mutationFn: loginBnbUser,
    onSuccess: (data) => {
      console.log('✅ OTP sent to email for login');
    },
    onError: (error: Error) => {
      console.error('❌ BNB user login failed:', error.message);
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
 * Google OAuth login API call
 */
export interface GoogleOAuthData {
  credential: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export const googleOAuthLogin = async (googleData: GoogleOAuthData): Promise<AuthResponse> => {
  console.log('🔵 Google OAuth Login Request:', `${API_URL}/bnb-users/google-auth`);
  console.log('📧 Email:', googleData.email);
  console.log('🔑 Credential length:', googleData.credential?.length || 0);
  console.log('👤 User data:', {
    firstName: googleData.firstName,
    lastName: googleData.lastName,
    profilePicture: googleData.profilePicture ? 'Present' : 'Missing'
  });

  const requestBody = {
    email: googleData.email,
    name: `${googleData.firstName} ${googleData.lastName}`.trim(),
    avatar: googleData.profilePicture,
  };

  console.log('📤 Request body:', requestBody);

  const response = await fetch(`${API_URL}/bnb-users/google-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('🔵 Response Status:', response.status);
  console.log('🔵 Response Headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    let errorMessage = 'Google OAuth login failed';
    try {
      const error = await response.json();
      console.log('🔴 Error response:', error);
      errorMessage = error.message || error.error || errorMessage;
    } catch (parseError) {
      console.log('🔴 Could not parse error response:', parseError);
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 Google OAuth Login Success:', data);

  return data;
};

/**
 * Hook for Google OAuth login mutation
 */
export const useGoogleOAuthLogin = () => {
  return useMutation({
    mutationFn: googleOAuthLogin,
    onSuccess: (data) => {
      console.log('📦 Google OAuth Response:', data);
      // Store the token in user storage
      const token = data.token || data.access_token;
      if (token) {
        setTokenByRole(token, 'bnbuser');
        console.log('✅ Token stored in localStorage as "userToken"');
        console.log('🔐 Token expires in 30 days');
      }
    },
    onError: (error: Error) => {
      console.error('❌ Google OAuth login failed:', error.message);
    },
  });
};

/**
 * Send phone OTP API call
 */
export const sendPhoneOTP = async (phoneNumber: string): Promise<AuthResponse> => {
  const { userToken } = require('@/lib/utils/tokenStorage');
  const token = userToken.get();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('🔵 Send Phone OTP Request:', `${API_URL}/bnb-users/send-otp`);
  console.log('📱 Phone:', phoneNumber);

  const response = await fetch(`${API_URL}/bnb-users/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNo: phoneNumber }),
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      const { userToken } = require('@/lib/utils/tokenStorage');
      userToken.remove();
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Failed to send phone OTP');
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 Phone OTP sent successfully');

  return data;
};

/**
 * Verify phone OTP API call
 */
export const verifyPhoneOTP = async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
  const { userToken } = require('@/lib/utils/tokenStorage');
  const token = userToken.get();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('🔵 Phone OTP Verification Request:', `${API_URL}/bnb-users/bnbVerifyOTP`);
  console.log('📱 Phone:', phoneNumber);

  const response = await fetch(`${API_URL}/bnb-users/bnbVerifyOTP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumber, otp }),
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      const { userToken } = require('@/lib/utils/tokenStorage');
      userToken.remove();
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Phone OTP verification failed');
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 Phone OTP verification successful');

  return data;
};

/**
 * Hook for sending phone OTP mutation
 */
export const useSendPhoneOTP = () => {
  return useMutation({
    mutationFn: sendPhoneOTP,
    onSuccess: () => {
      console.log('✅ Phone OTP sent successfully');
    },
    onError: (error: Error) => {
      console.error('❌ Failed to send phone OTP:', error.message);
    },
  });
};

/**
 * Hook for phone OTP verification mutation
 */
export const useVerifyPhoneOTP = () => {
  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) => 
      verifyPhoneOTP(phoneNumber, otp),
    onSuccess: (data) => {
      console.log('✅ Phone verification successful');
    },
    onError: (error: Error) => {
      console.error('❌ Phone OTP verification failed:', error.message);
    },
  });
};

/**
 * Upload Emirates ID document API call
 */
export const uploadEmiratesID = async (emiratesID: string, file: File): Promise<AuthResponse> => {
  const { userToken } = require('@/lib/utils/tokenStorage');
  const token = userToken.get();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log('🔵 Upload Emirates ID Request:', `${API_URL}/bnb-users/upload-emirates-id`);
  console.log('🆔 Emirates ID:', emiratesID);

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('emiratesIdNumber', emiratesID);
  formData.append('emiratesIdImage', file);

  const response = await fetch(`${API_URL}/bnb-users/upload-emirates-id`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  console.log('🔵 Response Status:', response.status);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      const { userToken } = require('@/lib/utils/tokenStorage');
      userToken.remove();
      throw new Error('Session expired. Please login again.');
    }
    const error = await response.json();
    console.log('🔴 Error:', error);
    throw new Error(error.message || 'Failed to upload Emirates ID');
  }

  const data: AuthResponse = await response.json();
  console.log('🟢 Emirates ID uploaded successfully');

  return data;
};

/**
 * Hook for uploading Emirates ID mutation
 */
export const useUploadEmiratesID = () => {
  return useMutation({
    mutationFn: ({ emiratesID, file }: { emiratesID: string; file: File }) => 
      uploadEmiratesID(emiratesID, file),
    onSuccess: (data) => {
      console.log('✅ Emirates ID uploaded successfully');
    },
    onError: (error: Error) => {
      console.error('❌ Failed to upload Emirates ID:', error.message);
    },
  });
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

