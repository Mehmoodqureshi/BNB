'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleOAuthProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

const GoogleOAuth: React.FC<GoogleOAuthProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google One Tap script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Client ID
          callback: handleCredentialResponse,
        });
        setIsScriptLoaded(true);
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log('🎉 Google credential response received:', response);
    setIsLoading(true);
    
    try {
      // Decode the JWT token to get user data
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('📋 Decoded user data:', payload);
      
      const user = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        profilePicture: payload.picture,
        isEmailVerified: payload.email_verified,
        isPhoneVerified: false,
        emirateID: false,
        joinedDate: new Date().toISOString().split('T')[0],
        responseRate: 100,
        responseTime: 'within an hour',
        isSuperhost: false,
        languages: ['English'],
        bio: 'Signed in with Google',
        work: '',
        location: '',
        socialMedia: {},
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

      console.log('✅ User created with real Google data:', user);
      onSuccess(user);
    } catch (error) {
      console.error('❌ Error processing Google response:', error);
      onError('Failed to process Google login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('🚀 Starting Google login process...');
    setIsLoading(true);
    
    // For now, simulate Google login with a more realistic flow
    // In production, this would use real Google OAuth
    setTimeout(() => {
      console.log('✅ Google login simulation completed');
      
      // Simulate getting user data from Google
      const user = {
        id: 'google_' + Date.now(),
        email: 'your-email@gmail.com', // This would be real from Google
        firstName: 'Your', // This would be real from Google
        lastName: 'Name', // This would be real from Google
        profilePicture: 'https://lh3.googleusercontent.com/a/default-user', // This would be real from Google
        isEmailVerified: true,
        isPhoneVerified: false,
        emirateID: false,
        joinedDate: new Date().toISOString().split('T')[0],
        responseRate: 100,
        responseTime: 'within an hour',
        isSuperhost: false,
        languages: ['English'],
        bio: 'Signed in with Google',
        work: '',
        location: '',
        socialMedia: {},
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

      console.log('✅ User created:', user);
      onSuccess(user);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        {isLoading ? 'Opening Google...' : 'Continue with Google'}
      </span>
    </button>
  );
};

export default GoogleOAuth;
