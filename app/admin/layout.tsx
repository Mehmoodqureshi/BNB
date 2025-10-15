'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminPropertyListingForm from '@/components/admin/AdminPropertyListingForm';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

interface AdminContextType {
  showAddPropertyModal: () => void;
  hideAddPropertyModal: () => void;
  adminUser: any;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminLayout');
  }
  return context;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  
  // Use admin authentication hook
  const { adminUser, isLoading, isAuthenticated, logout } = useAdminAuth();

  // Show loading state while checking auth
  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we authenticate your session</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, the useAdminAuth hook will handle redirect
  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleAddProperty = async (property: any) => {
    // TODO: Implement API call to create property
    console.log('Property created:', property);
    setShowPropertyModal(false);
    alert('Property created successfully! Refresh the properties page to see it.');
    
    // Optionally redirect to properties page
    if (pathname !== '/admin/properties') {
      router.push('/admin/properties');
    }
  };

  const contextValue: AdminContextType = {
    showAddPropertyModal: () => setShowPropertyModal(true),
    hideAddPropertyModal: () => setShowPropertyModal(false),
    adminUser,
    logout,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
      
      {/* Global Add Property Modal */}
      {showPropertyModal && (
        <AdminPropertyListingForm
          onSubmit={handleAddProperty}
          onCancel={() => setShowPropertyModal(false)}
          isLoading={false}
        />
      )}
    </AdminContext.Provider>
  );
}
