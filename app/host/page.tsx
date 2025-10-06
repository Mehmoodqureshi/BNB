'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import HostDashboard from '@/components/host/HostDashboard';
import PropertyListingForm from '@/components/host/PropertyListingForm';
import { PropertyListing } from '@/lib/types/host';

const HostPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'property-form'>('dashboard');

  // Button handlers for dashboard
  const handleAddProperty = () => {
    setEditingProperty(null);
    setCurrentView('property-form');
    setShowPropertyForm(true);
  };

  // Check URL parameters for actions
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add-property') {
      handleAddProperty();
      // Clean up URL
      router.replace('/host');
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading host dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to access the host dashboard.
          </p>
          <a
            href="/test-auth"
            className="inline-flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleCreateProperty = async (property: PropertyListing) => {
    try {
      // In a real app, this would make an API call to create the property
      console.log('Creating property:', property);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Close the form and show success
      setCurrentView('dashboard');
      setShowPropertyForm(false);
      setEditingProperty(null);
      
      // You could show a success toast here
      alert('Property listing created successfully!');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property listing. Please try again.');
    }
  };

  const handleEditProperty = (property: PropertyListing) => {
    setEditingProperty(property);
    setCurrentView('property-form');
    setShowPropertyForm(true);
  };

  const handleCancelForm = () => {
    setCurrentView('dashboard');
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const handleManageCalendar = () => {
    alert('Calendar management feature coming soon!');
    // router.push('/host/calendar');
  };

  const handleViewMessages = () => {
    router.push('/messages');
  };

  const handleHostSettings = () => {
    alert('Host settings feature coming soon!');
    // router.push('/host/settings');
  };

  const handleViewAllBookings = () => {
    router.push('/bookings');
  };

  if (currentView === 'property-form') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <PropertyListingForm
          onSubmit={handleCreateProperty}
          onCancel={handleCancelForm}
          initialData={editingProperty || undefined}
          isLoading={false}
        />
      </div>
    );
  }

  return (
    <HostDashboard 
      hostId={user.id}
      onAddProperty={handleAddProperty}
      onManageCalendar={handleManageCalendar}
      onViewMessages={handleViewMessages}
      onHostSettings={handleHostSettings}
      onViewAllBookings={handleViewAllBookings}
    />
  );
};

export default HostPage;
