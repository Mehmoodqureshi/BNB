'use client';

import React, { createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useHostAuth } from '@/lib/hooks/useHostAuth';

interface HostContextType {
  hostUser: any;
  logout: () => void;
}

const HostContext = createContext<HostContextType | undefined>(undefined);

export const useHostContext = () => {
  const context = useContext(HostContext);
  if (!context) {
    throw new Error('useHostContext must be used within HostLayout');
  }
  return context;
};

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Use host authentication hook
  const { hostUser, isLoading, isAuthenticated, logout } = useHostAuth();

  // Show loading state while checking auth
  if (isLoading && pathname !== '/host/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying agent access...</p>
        </div>
      </div>
    );
  }

  const contextValue: HostContextType = {
    hostUser,
    logout,
  };

  return (
    <HostContext.Provider value={contextValue}>
      {children}
    </HostContext.Provider>
  );
}

