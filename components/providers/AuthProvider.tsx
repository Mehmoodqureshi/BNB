'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        // Load user data from localStorage
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('✅ User loaded from localStorage:', parsedUser);
      } else {
        console.log('ℹ️ No user session found');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      // Clear invalid data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Test credentials for demo
      if (email === 'test@example.com' && password === 'password123') {
        const mockUser: User = {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          phoneNumber: '+971501234567',
          dateOfBirth: '1990-01-01',
          isEmailVerified: true,
          isPhoneVerified: true,
          emirateID: true,
          joinedDate: '2020-03-15',
          responseRate: 100,
          responseTime: 'within an hour',
          isSuperhost: true,
          languages: ['English', 'Arabic'],
          bio: 'Passionate traveler and host. Love meeting new people and sharing local experiences.',
          work: 'Software Engineer',
          location: 'Dubai, UAE',
          socialMedia: {
            instagram: '@johndoe',
            linkedin: 'linkedin.com/in/johndoe'
          },
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
            totalBookings: 45,
            totalReviews: 38,
            averageRating: 4.9,
            yearsHosting: 3
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('auth_token', 'mock_token_123');
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        console.log('✅ Login successful!', mockUser);
      } else {
        throw new Error('Invalid credentials. Use test@example.com / password123');
      }
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
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
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
