'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, tokenStorage, type AuthCredentials } from '@/lib/auth/authService';

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
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  verifyEmail: (token: string) => Promise<void>;
  verifyPhone: (phoneNumber: string, code: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resendVerificationSMS: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = getCurrentUser();
      
      if (currentUser && currentUser.role === 'bnbuser') {
        // Convert auth user to full user object
        const fullUser: User = {
          id: currentUser.id,
          email: currentUser.email,
          firstName: currentUser.name.split(' ')[0] || '',
          lastName: currentUser.name.split(' ').slice(1).join(' ') || '',
          isEmailVerified: false,
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
        console.log('✅ User loaded from token:', currentUser);
      } else {
        console.log('ℹ️ No user session found');
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
      
      // Convert to User object
      const fullUser: User = {
        id: response.id.toString(),
        email: response.email,
        firstName: response.name.split(' ')[0] || '',
        lastName: response.name.split(' ').slice(1).join(' ') || '',
        isEmailVerified: response.isActive,
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
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Register with:', userData);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
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
