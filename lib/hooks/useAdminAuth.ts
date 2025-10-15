'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, decodeToken } from '@/lib/auth/authService';
import { adminToken } from '@/lib/utils/tokenStorage';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export const useAdminAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 useAdminAuth useEffect triggered, pathname:', pathname);
    
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      console.log('⏭️ Skipping auth check for login page');
      setIsLoading(false);
      return;
    }

    // Add a small delay to ensure token is properly set after redirect
    const timer = setTimeout(() => {
      console.log('⏰ Timer triggered, calling checkAuth');
      checkAuth();
    }, 300);

    return () => {
      console.log('🧹 Cleaning up timer');
      clearTimeout(timer);
    };
  }, [pathname]);

  const checkAuth = () => {
    try {
      console.log('🔍 Checking admin authentication...');
      console.log('🔍 Current pathname:', pathname);
      
      // First check if admin token exists
      const token = adminToken.get();
      console.log('🔑 Admin token from storage:', token ? token.substring(0, 50) + '...' : 'null');
      
      if (!token) {
        console.log('❌ No admin token found in localStorage');
        logout();
        return;
      }

      console.log('🔑 Admin token found, decoding...');
      const currentUser = decodeToken(token);
      console.log('👤 Decoded user:', currentUser);

      // Check if user is logged in and has agency role (admin)
      if (!currentUser) {
        console.log('❌ Token exists but user decode failed - token might be invalid/expired');
        logout();
        return;
      }

      console.log('👤 User role:', currentUser.role, 'Expected: agency');
      if (currentUser.role !== 'agency') {
        console.log('❌ Access denied: User role is', currentUser.role, 'but required agency');
        logout();
        return;
      }

      console.log('✅ Admin authentication successful:', currentUser.email);

      // User is authenticated and has admin rights
      setAdminUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        token: token,
      });

      setIsLoading(false);
      console.log('✅ Admin user set, loading complete');
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      logout();
    }
  };

  const logout = () => {
    console.log('🚪 Logout called from useAdminAuth');
    console.log('🚪 Current pathname:', pathname);
    adminToken.remove(); // Remove admin token specifically
    setAdminUser(null);
    setIsLoading(false);
    
    if (pathname !== '/admin/login') {
      console.log('🚪 Redirecting to admin login');
      router.push('/admin/login');
    }
  };

  return {
    adminUser,
    isLoading,
    isAuthenticated: !!adminUser,
    isAgency: adminUser?.role === 'agency',
    logout,
  };
};

