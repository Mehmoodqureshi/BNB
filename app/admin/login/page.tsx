'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, Mail, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLogin, getCurrentUser, decodeToken } from '@/lib/auth/authService';
import { adminToken, setTokenByRole } from '@/lib/utils/tokenStorage';
import { getRoleRedirect } from '@/lib/auth/roleGuard';

const AdminLoginPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [urlTokenFound, setUrlTokenFound] = useState(false);

  // 🚀 Unified Auth Service
  const loginMutation = useLogin();

  // Check for token in URL or stored token on component mount
  useEffect(() => {
    const checkTokenAuth = async () => {
      try {
        // First check if there's a token in URL
        const urlToken = searchParams.get('token');
        
        if (urlToken) {
          console.log('🔑 Token found in URL, attempting auto-login...');
          console.log('🔑 Token value:', urlToken.substring(0, 50) + '...');
          setUrlTokenFound(true);
          
          // Store the URL token in admin storage
          adminToken.set(urlToken);
          console.log('💾 Admin token stored in localStorage as "adminToken"');
          
          // Wait a moment for storage to complete
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Verify the token and get user info
          const currentUser = decodeToken(urlToken);
          console.log('👤 Current user from token:', currentUser);
          
          if (currentUser && currentUser.role === 'agency') {
            console.log('✅ URL token is valid for admin, redirecting...');
            const redirectPath = getRoleRedirect(currentUser.role);
            console.log('🚀 Redirecting to:', redirectPath);
            // Add a small delay to ensure token is properly stored
            setTimeout(() => {
              router.push(redirectPath);
            }, 200);
            return;
          } else {
            console.log('❌ URL token is invalid or not for admin');
            console.log('❌ User role:', currentUser?.role, 'Expected: agency');
            adminToken.remove();
          }
        } else {
          // No URL token, check stored admin token
          const storedToken = adminToken.get();
          
          if (storedToken) {
            console.log('🔑 Stored admin token found, checking validity...');
            const currentUser = decodeToken(storedToken);
            
            if (currentUser && currentUser.role === 'agency') {
              console.log('✅ Stored token is valid for admin, redirecting...');
              const redirectPath = getRoleRedirect(currentUser.role);
              // Add a small delay to ensure token is properly stored
              setTimeout(() => {
                router.push(redirectPath);
              }, 200);
              return;
            } else {
              console.log('❌ Stored token is invalid or not for admin');
              adminToken.remove();
            }
          }
        }
      } catch (error) {
        console.error('❌ Token validation failed:', error);
        adminToken.remove();
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkTokenAuth();
  }, [searchParams, router]);

  const handleLoginSuccess = (data: any) => {
    // Check if user has agency role
    if (data.role !== 'agency') {
      alert('Access denied: Only agency accounts can access the admin panel');
      return;
    }

    // Store the token in admin storage
    if (data.access_token) {
      adminToken.set(data.access_token);
      console.log('💾 Admin token stored after login');
    }

    // Redirect to appropriate dashboard based on role
    const redirectPath = getRoleRedirect(data.role);
    router.push(redirectPath);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: handleLoginSuccess,
      }
    );
  };

  // Show loading state while checking for tokens
  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authentication...</p>
          <p className="text-blue-200 text-sm mt-2">Verifying token access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-8 text-white text-center">
            <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-blue-100">Platform Management & Control</p>
          </div>

        

          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dalilebnb.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* URL Token Message */}
            {urlTokenFound && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Token found in URL but is invalid or expired. Please login with your credentials.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {loginMutation.isError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {loginMutation.error?.message || 'Login failed. Please try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={loginMutation.isPending || !email || !password}
              className="w-full flex items-center justify-center space-x-2 py-3 text-base"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </Button>

            {/* Back to Home */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-sm text-[#006699] hover:text-[#005588] font-medium"
              >
                ← Back to Main Site
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <Lock className="h-3 w-3" />
              <span>Secure admin authentication</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            This is a restricted area. All actions are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
