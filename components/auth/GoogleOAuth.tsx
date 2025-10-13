'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleOAuthProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '432273989078-r95trghdbgi0h0m8dski8abr50idb9tm.apps.googleusercontent.com';

const GoogleOAuth: React.FC<GoogleOAuthProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // ✅ Load Google script
  useEffect(() => {
    if (window.google) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsScriptLoaded(true);
      console.log('✅ Google script loaded');
      console.log('🌐 Google object after load:', !!window.google);
    };

    script.onerror = () => {
      console.error('❌ Failed to load Google script');
      onError('Failed to load Google services');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [onError]);

  // ✅ Handle token decoding and user creation
  const handleCredential = useCallback(
    (response: any) => {
      console.log('🎯 Google credential callback triggered');
      console.log('📨 Response received:', response);
      try {
        const payload = jwtDecode<any>(response.credential);
        console.log('📋 Decoded Google Payload:', payload);

        const user = {
          credential: response.credential, // JWT token from Google
          googleId: payload.sub, // Google user ID
          id: payload.sub,
          email: payload.email,
          firstName: payload.given_name || '',
          lastName: payload.family_name || '',
          profilePicture: payload.picture || '',
          isEmailVerified: payload.email_verified || false,
          joinedDate: new Date().toISOString().split('T')[0],
          languages: ['English'],
          bio: 'Signed in with Google',
          preferences: {
            currency: 'AED',
            language: 'en',
            notifications: { email: true, sms: false, push: true },
          },
          stats: { totalBookings: 0, totalReviews: 0, averageRating: 0 },
        };

        console.log('✅ Google user created:', user);
        onSuccess(user);
      } catch (err) {
        console.error('❌ Invalid Google token', err);
        onError('Failed to verify Google login');
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  // ✅ Trigger login
  const handleGoogleLogin = useCallback(() => {
    console.log('🚀 Google login button clicked');
    console.log('📊 Script loaded:', isScriptLoaded);
    console.log('🌐 Google object available:', !!window.google);
    console.log('🔑 Client ID:', GOOGLE_CLIENT_ID);
    
    if (!isScriptLoaded || !window.google) {
      console.error('❌ Google service not ready');
      onError('Google service not ready yet. Please wait...');
      return;
    }

    setIsLoading(true);
    console.log('⏳ Starting Google login process...');

    try {
      // Use a more reliable approach - direct OAuth2 flow
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response: any) => {
          console.log('🎯 OAuth callback triggered:', response);
          if (response.error) {
            console.error('❌ Google OAuth error:', response.error);
            onError('Google login failed: ' + response.error);
            setIsLoading(false);
            return;
          }

          try {
            // Fetch user info via token
            console.log('📡 Fetching user info...');
            const userInfo = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`,
            ).then((r) => r.json());

            console.log('👤 User info received:', userInfo);

            const user = {
              credential: response.access_token, // Use access token as credential
              googleId: userInfo.id, // Google user ID
              id: userInfo.id,
              email: userInfo.email,
              firstName: userInfo.given_name || '',
              lastName: userInfo.family_name || '',
              profilePicture: userInfo.picture || '',
              isEmailVerified: userInfo.verified_email || false,
              joinedDate: new Date().toISOString().split('T')[0],
              languages: ['English'],
              bio: 'Signed in with Google',
              preferences: {
                currency: 'AED',
                language: 'en',
                notifications: { email: true, sms: false, push: true },
              },
              stats: { totalBookings: 0, totalReviews: 0, averageRating: 0 },
            };

            console.log('✅ User logged in successfully:', user);
            onSuccess(user);
            setIsLoading(false);
          } catch (error) {
            console.error('❌ Error fetching user info:', error);
            onError('Failed to fetch user information');
            setIsLoading(false);
          }
        },
      });
      
      console.log('🚀 Requesting access token...');
      tokenClient.requestAccessToken();
      
      // Add a timeout to handle cases where popup is blocked
      setTimeout(() => {
        if (isLoading) {
          console.log('⏰ OAuth timeout - user might have blocked popup');
          setIsLoading(false);
          onError('Authentication was blocked. Please allow popups for this site and try again.');
        }
      }, 15000); // 15 second timeout
      
    } catch (error) {
      console.error('❌ Error starting Google login', error);
      onError('Error initializing Google login');
      setIsLoading(false);
    }
  }, [isScriptLoaded, onError, onSuccess]);

  return (
    <button
      type="button"
      onClick={() => {
        console.log('🖱️ Google button clicked!');
        handleGoogleLogin();
      }}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>

      <span className="text-gray-700 dark:text-gray-200 font-medium">
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </span>
      {isLoading && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          If a popup doesn't appear, please allow popups for this site
        </div>
      )}
    </button>
  );
};

export default GoogleOAuth;
