'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, tokenStorage, logout as authLogout } from '@/lib/auth/authService';

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
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    try {
      const currentUser = getCurrentUser();

      // Check if user is logged in and has agency role (admin)
      if (!currentUser || currentUser.role !== 'agency') {
        console.log('❌ Access denied: Not an agency user');
        logout();
        return;
      }

      // User is authenticated and has admin rights
      setAdminUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        token: tokenStorage.get() || '',
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    }
  };

  const logout = () => {
    authLogout();
    setAdminUser(null);
    setIsLoading(false);
    
    if (pathname !== '/admin/login') {
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

