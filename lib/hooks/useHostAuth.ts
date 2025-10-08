'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, tokenStorage, logout as authLogout } from '@/lib/auth/authService';

export interface HostUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export const useHostAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [hostUser, setHostUser] = useState<HostUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/host/login') {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    try {
      const currentUser = getCurrentUser();

      // Check if user is logged in and has agent role (host)
      if (!currentUser || currentUser.role !== 'agent') {
        console.log('❌ Access denied: Not an agent user');
        logout();
        return;
      }

      // User is authenticated and has host rights
      setHostUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        token: tokenStorage.get() || '',
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Host auth check failed:', error);
      logout();
    }
  };

  const logout = () => {
    authLogout();
    setHostUser(null);
    setIsLoading(false);
    
    if (pathname !== '/host/login') {
      router.push('/host/login');
    }
  };

  return {
    hostUser,
    isLoading,
    isAuthenticated: !!hostUser,
    isAgent: hostUser?.role === 'agent',
    logout,
  };
};

