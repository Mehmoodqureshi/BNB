/**
 * Role-based Access Control
 * Guards for protecting routes based on user roles
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, type UserRole } from './authService';
import { getCurrentToken } from '@/lib/utils/tokenStorage';

/**
 * Hook to protect routes based on user role
 */
export const useRoleGuard = (allowedRoles: UserRole[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [pathname]);

  const checkAccess = () => {
    const user = getCurrentUser();

    if (!user) {
      console.log('❌ No authentication found');
      setIsAuthorized(false);
      setIsLoading(false);
      redirectToLogin(pathname);
      return;
    }

    // Check if token exists for the user's role
    const token = getCurrentToken(user.role);
    if (!token) {
      console.log('❌ No token found for role:', user.role);
      setIsAuthorized(false);
      setIsLoading(false);
      redirectToLogin(pathname);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      console.log(`❌ Access denied: User role "${user.role}" not in allowed roles:`, allowedRoles);
      setIsAuthorized(false);
      setIsLoading(false);
      redirectToLogin(pathname);
      return;
    }

    console.log(`✅ Access granted: ${user.email} (${user.role})`);
    setIsAuthorized(true);
    setIsLoading(false);
  };

  const redirectToLogin = (returnUrl: string) => {
    // Redirect to appropriate login based on the route
    if (returnUrl.startsWith('/admin')) {
      router.push('/admin/login');
    } else if (returnUrl.startsWith('/host')) {
      router.push('/host/login');
    } else {
      router.push('/');
    }
  };

  return {
    isAuthorized,
    isLoading,
    user: getCurrentUser(),
  };
};

/**
 * Get redirect path based on user role
 */
export const getRoleRedirect = (role: UserRole): string => {
  switch (role) {
    case 'agency':
      return '/admin';
    case 'agent':
      return '/host';
    case 'bnbuser':
    default:
      return '/';
  }
};

