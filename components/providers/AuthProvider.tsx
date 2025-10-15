'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logout as apiLogout, getCurrentUser, decodeToken, useRegister as useRegisterMutation, useVerifyOTP as useVerifyOTPMutation, useResendOTP as useResendOTPMutation, useLoginBnbUser as useLoginBnbUserMutation, useGoogleOAuthLogin as useGoogleOAuthLoginMutation, updateProfile as apiUpdateProfile, getUserProfile as apiGetUserProfile, type UpdateProfileData, type GoogleOAuthData } from '@/lib/auth/authService';
import { userToken } from '@/lib/utils/tokenStorage';

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
  login: (email: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  googleOAuthLogin: (googleData: GoogleOAuthData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  verifyEmail: (token: string) => Promise<void>;
  verifyPhone: (phoneNumber: string, code: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resendVerificationSMS: (phoneNumber: string) => Promise<void>;
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
  const loginBnbUserMutation = useLoginBnbUserMutation();
  const googleOAuthLoginMutation = useGoogleOAuthLoginMutation();

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = userToken.get();
      
      if (!token) {
        console.log('ℹ️ No user token found in localStorage');
        setIsLoading(false);
        return;
      }
      
      const currentUser = decodeToken(token);
      
      if (!currentUser) {
        console.log('🔴 Invalid or expired token, removing...');
        userToken.remove();
        setIsLoading(false);
        return;
      }
      
      if (currentUser.role === 'bnbuser') {
        // Fetch full profile from API
        try {
          const profileData = await apiGetUserProfile();
          
          // Extract bnbUser data if it exists (nested structure)
          const bnbUser = profileData.bnbUser || {};
          
          // Convert API response to User object
          const nameParts = (profileData.name || currentUser.name).split(' ');
          const fullUser: User = {
            id: profileData.id?.toString() || currentUser.id,
            email: profileData.email || currentUser.email,
            firstName: bnbUser.firstName || profileData.firstName || nameParts[0] || '',
            lastName: bnbUser.lastName || profileData.lastName || nameParts.slice(1).join(' ') || '',
            profilePicture: profileData.avatar || bnbUser.avatar || profileData.profilePicture,
            phoneNumber: bnbUser.phoneNumber || profileData.phoneNumber,
            dateOfBirth: bnbUser.dateOfBirth || profileData.dateOfBirth,
            isEmailVerified: bnbUser.isEmailVerified || profileData.isEmailVerified || true,
            isPhoneVerified: bnbUser.isPhoneVerified || profileData.isPhoneVerified || false,
            emirateID: bnbUser.emirateID || profileData.emirateID || false,
            joinedDate: profileData.createdAt || bnbUser.joinedDate || profileData.joinedDate || new Date().toISOString(),
            isSuperhost: bnbUser.isSuperhost || profileData.isSuperhost || false,
            languages: bnbUser.languages || profileData.languages || ['English'],
            bio: bnbUser.bio || profileData.bio,
            work: bnbUser.work || profileData.work,
            location: bnbUser.location || profileData.location,
            socialMedia: bnbUser.socialMedia || profileData.socialMedia,
            responseRate: bnbUser.responseRate || profileData.responseRate,
            responseTime: bnbUser.responseTime || profileData.responseTime,
            preferences: bnbUser.preferences || profileData.preferences || {
              currency: 'AED',
              language: 'en',
              notifications: {
                email: true,
                sms: true,
                push: true
              }
            },
            stats: bnbUser.stats || profileData.stats || {
              totalBookings: 0,
              totalReviews: 0,
              averageRating: 0,
              yearsHosting: 0
            }
          };
          
          setUser(fullUser);
          console.log('✅ User profile loaded from API');
          console.log('👤 User:', fullUser.firstName, fullUser.lastName, '(' + fullUser.email + ')');
        } catch (profileError) {
          console.error('⚠️ Failed to fetch profile, using token data:', profileError);
          
          // Fallback to token data if profile fetch fails
          const nameParts = currentUser.name.split(' ');
          const fallbackUser: User = {
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
          
          setUser(fallbackUser);
          console.log('✅ User auto-logged in from stored token (fallback)');
        }
      } else {
        console.log('ℹ️ Token exists but not for bnbuser role:', currentUser.role);
        // Don't remove the token - it might be for admin/agent which are handled by their respective hooks
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      userToken.remove();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    try {
      // Call BNB user login API (sends OTP)
      const response = await loginBnbUserMutation.mutateAsync(email);
      console.log('✅ Login OTP sent to email');
      // Don't set user yet, wait for OTP verification
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
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
        // Fetch full profile from API after successful OTP verification
        try {
          const profileData = await apiGetUserProfile();
          
          // Extract bnbUser data if it exists (nested structure)
          const bnbUser = profileData.bnbUser || {};
          
          // Convert API response to User object
          const nameParts = (profileData.name || response.user.name).split(' ');
          const fullUser: User = {
            id: profileData.id?.toString() || response.user.id.toString(),
            email: profileData.email || response.user.email,
            firstName: bnbUser.firstName || profileData.firstName || nameParts[0] || '',
            lastName: bnbUser.lastName || profileData.lastName || nameParts.slice(1).join(' ') || '',
            profilePicture: profileData.avatar || bnbUser.avatar || profileData.profilePicture,
            phoneNumber: bnbUser.phoneNumber || profileData.phoneNumber,
            dateOfBirth: bnbUser.dateOfBirth || profileData.dateOfBirth,
            isEmailVerified: bnbUser.isEmailVerified || profileData.isEmailVerified || true,
            isPhoneVerified: bnbUser.isPhoneVerified || profileData.isPhoneVerified || false,
            emirateID: bnbUser.emirateID || profileData.emirateID || false,
            joinedDate: profileData.createdAt || bnbUser.joinedDate || profileData.joinedDate || new Date().toISOString(),
            isSuperhost: bnbUser.isSuperhost || profileData.isSuperhost || false,
            languages: bnbUser.languages || profileData.languages || ['English'],
            bio: bnbUser.bio || profileData.bio,
            work: bnbUser.work || profileData.work,
            location: bnbUser.location || profileData.location,
            socialMedia: bnbUser.socialMedia || profileData.socialMedia,
            responseRate: bnbUser.responseRate || profileData.responseRate,
            responseTime: bnbUser.responseTime || profileData.responseTime,
            preferences: bnbUser.preferences || profileData.preferences || {
              currency: 'AED',
              language: 'en',
              notifications: {
                email: true,
                sms: true,
                push: true
              }
            },
            stats: bnbUser.stats || profileData.stats || {
              totalBookings: 0,
              totalReviews: 0,
              averageRating: 0,
              yearsHosting: 0
            }
          };
          
          setUser(fullUser);
          console.log('✅ User profile loaded after OTP verification');
        } catch (profileError) {
          console.error('⚠️ Failed to fetch profile after OTP, using basic data:', profileError);
          
          // Fallback to basic user data if profile fetch fails
          const nameParts = response.user.name.split(' ');
          const fallbackUser: User = {
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
          setUser(fallbackUser);
          console.log('✅ User logged in with fallback data');
        }
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

  const googleOAuthLogin = async (googleData: GoogleOAuthData) => {
    try {
      console.log('🚀 Starting Google OAuth login...', googleData.email);
      
      // Call Google OAuth API
      const response = await googleOAuthLoginMutation.mutateAsync(googleData);
      
      // Set user data from response
      if (response.user) {
        // Fetch full profile from API after successful Google OAuth
        try {
          const profileData = await apiGetUserProfile();
          
          // Extract bnbUser data if it exists (nested structure)
          const bnbUser = profileData.bnbUser || {};
          
          // Convert API response to User object
          const nameParts = (profileData.name || response.user.name).split(' ');
          const fullUser: User = {
            id: profileData.id?.toString() || response.user.id.toString(),
            email: profileData.email || response.user.email,
            firstName: bnbUser.firstName || profileData.firstName || nameParts[0] || '',
            lastName: bnbUser.lastName || profileData.lastName || nameParts.slice(1).join(' ') || '',
            profilePicture: profileData.avatar || bnbUser.avatar || profileData.profilePicture || googleData.profilePicture,
            phoneNumber: bnbUser.phoneNumber || profileData.phoneNumber,
            dateOfBirth: bnbUser.dateOfBirth || profileData.dateOfBirth,
            isEmailVerified: profileData.isEmailVerified || true,
            isPhoneVerified: bnbUser.isPhoneVerified || profileData.isPhoneVerified || false,
            emirateID: bnbUser.emirateID || profileData.emirateID || false,
            joinedDate: profileData.joinedDate || bnbUser.joinedDate || new Date().toISOString(),
            responseRate: bnbUser.responseRate || profileData.responseRate || 100,
            responseTime: bnbUser.responseTime || profileData.responseTime || 'within an hour',
            isSuperhost: bnbUser.isSuperhost || profileData.isSuperhost || false,
            languages: bnbUser.languages || profileData.languages || ['English'],
            bio: bnbUser.bio || profileData.bio || 'Signed in with Google',
            work: bnbUser.work || profileData.work || '',
            location: bnbUser.location || profileData.location || '',
            socialMedia: bnbUser.socialMedia || profileData.socialMedia || {},
            preferences: bnbUser.preferences || profileData.preferences || {
              currency: 'AED',
              language: 'en',
              notifications: {
                email: true,
                sms: false,
                push: true
              }
            },
            stats: bnbUser.stats || profileData.stats || {
              totalBookings: 0,
              totalReviews: 0,
              averageRating: 0,
              yearsHosting: 0
            }
          };
          
          setUser(fullUser);
          console.log('✅ User profile loaded after Google OAuth login');
        } catch (profileError) {
          console.error('⚠️ Failed to fetch profile after Google OAuth, using basic data:', profileError);
          
          // Fallback to basic user data if profile fetch fails
          const nameParts = response.user.name.split(' ');
          const fallbackUser: User = {
            id: response.user.id.toString(),
            email: response.user.email,
            firstName: googleData.firstName || nameParts[0] || '',
            lastName: googleData.lastName || nameParts.slice(1).join(' ') || '',
            profilePicture: googleData.profilePicture,
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
                sms: false,
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
          
          setUser(fallbackUser);
          console.log('✅ User logged in with Google OAuth (fallback data)');
        }
      }
    } catch (error) {
      console.error('❌ Google OAuth login failed:', error);
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
    
    try {
      // Only send firstName and lastName to API
      const profileData: UpdateProfileData = {};
      
      if (userData.firstName !== undefined) {
        profileData.firstName = userData.firstName;
      }
      if (userData.lastName !== undefined) {
        profileData.lastName = userData.lastName;
      }
      
      // Call API to update profile
      const response = await apiUpdateProfile(profileData);
      
      // Update local user state with response data + provided userData (including fields not sent to API)
      const updatedUser = { 
        ...user, 
        ...userData,
        // Override with API response if available
        firstName: response.firstName || userData.firstName || user.firstName,
        lastName: response.lastName || userData.lastName || user.lastName,
        profilePicture: response.avatar || response.avatarUrl || response.profilePicture || userData.profilePicture || user.profilePicture
      };
      setUser(updatedUser);
      
      console.log('✅ Profile updated successfully:', updatedUser);
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw error;
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    try {
      // Upload file using updateProfile endpoint with FormData
      const response = await apiUpdateProfile({ avatar: file });
      
      // Get avatar URL from response
      const imageUrl = response.avatar || response.avatarUrl || response.profilePicture;
      
      // Update user data with new profile picture
      if (user && imageUrl) {
        const updatedUser = { ...user, profilePicture: imageUrl };
        setUser(updatedUser);
        console.log('✅ Profile picture updated successfully:', imageUrl);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('❌ Profile picture upload failed:', error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    // TODO: Implement email verification
    console.log('Verify email with token:', token);
  };

  const verifyPhone = async (phoneNumber: string, code: string) => {
    try {
      const token = userToken.get();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_END_POINT}/bnb-users/bnbVerifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber, otp: code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Phone verification failed');
      }

      const data = await response.json();
      console.log('✅ Phone verification successful');
      return data;
    } catch (error) {
      console.error('❌ Phone verification failed:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    // TODO: Implement resend verification email
    console.log('Resend verification email');
  };

  const resendVerificationSMS = async (phoneNumber: string) => {
    try {
      const token = userToken.get();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_END_POINT}/bnb-users/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNo: phoneNumber }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend SMS');
      }

      console.log('✅ SMS resent successfully');
    } catch (error) {
      console.error('❌ Failed to resend SMS:', error);
      throw error;
    }
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
    googleOAuthLogin,
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
