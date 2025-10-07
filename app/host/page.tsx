'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import HostDashboard from '@/components/host/HostDashboard';
import PropertyListingForm from '@/components/host/PropertyListingForm';
import { PropertyListing } from '@/lib/types/host';
import { X, Save, Bell, DollarSign, User } from 'lucide-react';
import CalendarManagement from '@/components/host/CalendarManagement';

const HostPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'property-form'>('dashboard');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:bg-gray-900">
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
    setShowCalendarModal(true);
  };

  const handleViewMessages = () => {
    router.push('/messages');
  };

  const handleHostSettings = () => {
    setShowSettingsModal(true);
  };

  const handleViewAllBookings = () => {
    router.push('/bookings');
  };

  const handleViewPayouts = () => {
    router.push('/host/payouts');
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
    <>
      <HostDashboard 
        hostId={user.id}
        onAddProperty={handleAddProperty}
        onManageCalendar={handleManageCalendar}
        onViewMessages={handleViewMessages}
        onHostSettings={handleHostSettings}
        onViewAllBookings={handleViewAllBookings}
        onViewPayouts={handleViewPayouts}
      />

      {/* Calendar Management Modal */}
      {showCalendarModal && (
        <CalendarManagement onClose={() => setShowCalendarModal(false)} />
      )}

      {/* Host Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Host Settings</h2>
                    <p className="text-blue-100 text-sm">Manage your hosting preferences and account</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="h-5 w-5 text-[#006699] dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user ? `${user.firstName} ${user.lastName}` : ''}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+971 50 123 4567"
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                      <select className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white">
                        <option>English</option>
                        <option>Arabic</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Bell className="h-5 w-5 text-[#006699] dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'New Booking Alerts', description: 'Get notified when you receive a new booking' },
                      { label: 'Message Notifications', description: 'Receive alerts for new guest messages' },
                      { label: 'Review Reminders', description: 'Reminder to respond to guest reviews' },
                      { label: 'Payment Updates', description: 'Notifications about payouts and transactions' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#006699]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payout Settings */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <DollarSign className="h-5 w-5 text-[#006699] dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payout Preferences</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payout Method</label>
                      <select className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white">
                        <option>Bank Transfer</option>
                        <option>PayPal</option>
                        <option>Stripe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payout Schedule</label>
                      <select className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-[#006699] to-[#0088cc] text-white rounded-xl hover:from-[#005588] hover:to-[#006699] transition-all font-semibold flex items-center space-x-2"
                  onClick={() => {
                    setShowSettingsModal(false);
                    // Add success notification here
                    alert('Settings saved successfully!');
                  }}
                >
                  <Save className="h-5 w-5" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HostPage;
