'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, tokenStorage, type AuthCredentials, useRegister as useRegisterMutation, useVerifyOTP as useVerifyOTPMutation, useResendOTP as useResendOTPMutation } from '@/lib/auth/authService';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emirateID: boolean;
  joinedDate: string;
  responseRate?: number;
  responseTime?: string;
  isSuperhost: boolean;
  languages: string[];
  bio?: string;
  work?: string;
  location?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  preferences: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  stats: {
    totalBookings: number;
    totalReviews: number;
    averageRating: number;
    yearsHosting: number;
  };
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  verifyEmail: (token: string) => Promise<void>;
  verifyPhone: (phoneNumber: string, code: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resendVerificationSMS: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TanStack Query hooks
  const registerMutation = useRegisterMutation();
  const verifyOTPMutation = useVerifyOTPMutation();
  const resendOTPMutation = useResendOTPMutation();

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = tokenStorage.get();
      
      if (!token) {
        console.log('ℹ️ No token found in localStorage');
        setIsLoading(false);
        return;
      }
      
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        console.log('🔴 Invalid or expired token, removing...');
        tokenStorage.remove();
        setIsLoading(false);
        return;
      }
      
      if (currentUser.role === 'bnbuser') {
        // Convert auth user to full user object
        const nameParts = currentUser.name.split(' ');
        const fullUser: User = {
          id: currentUser.id,
          email: currentUser.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          isEmailVerified: true,
          isPhoneVerified: false,
          emirateID: false,
          joinedDate: new Date().toISOString(),
          isSuperhost: false,
          languages: ['English'],
          preferences: {
            currency: 'AED',
            language: 'en',
            notifications: {
              email: true,
              sms: true,
              push: true
            }
          },
          stats: {
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
            yearsHosting: 0
          }
        };
        
        setUser(fullUser);
        console.log('✅ User auto-logged in from stored token');
        console.log('👤 User:', currentUser.name, '(' + currentUser.email + ')');
      } else {
        console.log('ℹ️ Token exists but wrong role:', currentUser.role);
        tokenStorage.remove();
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      tokenStorage.remove();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call unified auth service
      const response = await apiLogin({ email, password });
      
      // Check if user has bnbuser role
      if (response.role !== 'bnbuser') {
        throw new Error('Invalid account type. Please use the appropriate login page.');
      }
      
      // Safely extract name parts
      const name = response.name || '';
      const nameParts = name.trim().split(' ');
      
      // Convert to User object
      const fullUser: User = {
        id: response.id?.toString() || 'unknown',
        email: response.email || email,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        isEmailVerified: response.isActive || false,
        isPhoneVerified: false,
        emirateID: false,
        joinedDate: new Date().toISOString(),
        isSuperhost: false,
        languages: ['English'],
        preferences: {
          currency: 'AED',
          language: 'en',
          notifications: {
            email: true,
            sms: true,
            push: true
          }
        },
        stats: {
          totalBookings: 0,
          totalReviews: 0,
          averageRating: 0,
          yearsHosting: 0
        }
      };
      
      setUser(fullUser);
      console.log('✅ User login successful!', fullUser);
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  const register = async (userData: RegisterData) => {
    try {
      const response = await registerMutation.mutateAsync(userData);
      console.log('✅ Registration successful!', response);
      // Don't store token yet, wait for OTP verification
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      // Call the OTP verification API using TanStack Query
      const response = await verifyOTPMutation.mutateAsync({ email, otp });
      
      // Set user data from response
      if (response.user) {
        const nameParts = response.user.name.split(' ');
        const fullUser: User = {
          id: response.user.id.toString(),
          email: response.user.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          isEmailVerified: true,
          isPhoneVerified: false,
          emirateID: false,
          joinedDate: new Date().toISOString(),
          isSuperhost: false,
          languages: ['English'],
          preferences: {
            currency: 'AED',
            language: 'en',
            notifications: {
              email: true,
              sms: true,
              push: true
            }
          },
          stats: {
            totalBookings: 0,
            totalReviews: 0,
            averageRating: 0,
            yearsHosting: 0
          }
        };
        setUser(fullUser);
        console.log('✅ User logged in:', fullUser);
      }
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      throw error;
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await resendOTPMutation.mutateAsync(email);
      console.log('✅ OTP resent successfully');
    } catch (error) {
      console.error('❌ Failed to resend OTP:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    console.log('✅ User logged out successfully');
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      console.log('✅ Profile updated successfully:', updatedUser);
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw new Error('Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a preview URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      
      // Update user data with new profile picture
      if (user) {
        const updatedUser = { ...user, profilePicture: imageUrl };
        setUser(updatedUser);
        
        // Save to localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        console.log('✅ Profile picture updated successfully:', imageUrl);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('❌ Profile picture upload failed:', error);
      throw new Error('Profile picture upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    // TODO: Implement email verification
    console.log('Verify email with token:', token);
  };

  const verifyPhone = async (phoneNumber: string, code: string) => {
    // TODO: Implement phone verification
    console.log('Verify phone:', phoneNumber, 'with code:', code);
  };

  const resendVerificationEmail = async () => {
    // TODO: Implement resend verification email
    console.log('Resend verification email');
  };

  const resendVerificationSMS = async () => {
    // TODO: Implement resend verification SMS
    console.log('Resend verification SMS');
  };

  const value: AuthContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateProfile,
    uploadProfilePicture,
    verifyEmail,
    verifyPhone,
    resendVerificationEmail,
    resendVerificationSMS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
