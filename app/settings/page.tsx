'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  Settings, ChevronLeft, User, Bell, Shield, CreditCard, 
  Globe, Moon, Sun, LogOut, Trash2, Save, Eye, EyeOff, MessageSquare
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    preferences: {
      language: 'en',
      currency: 'AED',
      timezone: 'Asia/Dubai'
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/test-auth');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings via API
    console.log('Saving settings:', settings);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'support', label: 'Support', icon: MessageSquare },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-gray-200 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Settings className="h-6 w-6 text-[#006699] mr-2" />
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700/50">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[#006699] text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.profilePicture}
                        alt={user.firstName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <button className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors">
                          Change Photo
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.firstName}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.lastName}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue={user.phoneNumber || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        defaultValue={user.bio || ''}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                      {[
                        { key: 'email', label: 'Booking confirmations and updates', description: 'Get notified about your bookings' },
                        { key: 'sms', label: 'SMS notifications', description: 'Receive text messages for urgent updates' },
                        { key: 'push', label: 'Push notifications', description: 'Get notified on your device' },
                        { key: 'marketing', label: 'Marketing emails', description: 'Receive promotional offers and updates' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{item.label}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                notifications: {
                                  ...prev.notifications,
                                  [item.key]: e.target.checked
                                }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006699]/20 dark:peer-focus:ring-[#006699]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#006699]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, profileVisibility: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h4>
                      {[
                        { key: 'showEmail', label: 'Show email address', description: 'Let others see your email' },
                        { key: 'showPhone', label: 'Show phone number', description: 'Let others see your phone number' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{item.label}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                privacy: {
                                  ...prev.privacy,
                                  [item.key]: e.target.checked
                                }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006699]/20 dark:peer-focus:ring-[#006699]/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#006699]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment & Billing</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Methods</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Manage your saved payment methods for faster checkout.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => router.push('/payments')}
                          className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
                        >
                          Manage Payment Methods
                        </button>
                        <button 
                          onClick={() => router.push('/transactions')}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          View Transaction History
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Refunds</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Track your refund requests and their status.
                      </p>
                      <button 
                        onClick={() => router.push('/refunds')}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      >
                        View Refund Status
                      </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Billing Information</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Update your billing address and tax information.
                      </p>
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                        Edit Billing Address
                      </button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Secure Payment Processing
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        All payments are processed securely by Stripe. Your payment information is encrypted and never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'support' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Customer Support</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Support Tickets</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        View and manage your support tickets and complaints.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => router.push('/support')}
                          className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
                        >
                          View Support Tickets
                        </button>
                        <button 
                          onClick={() => router.push('/help')}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        >
                          Browse Help Center
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Get in touch with our support team for immediate assistance.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button 
                          onClick={() => window.open('tel:+97141234567')}
                          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">📞</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Call Support</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">+971 4 123 4567</p>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => window.open('mailto:support@bnb.com')}
                          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-green-600 dark:text-green-400 text-sm font-medium">✉️</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Email Support</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">support@bnb.com</p>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => router.push('/support')}
                          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="text-center">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">💬</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Live Chat</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Available 24/7</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Submit a Complaint</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Report issues with bookings, properties, or hosts directly to our support team.
                      </p>
                      <button 
                        onClick={() => router.push('/support')}
                        className="px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                      >
                        Submit Complaint
                      </button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        24/7 Support Available
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Our support team is available around the clock to help with any issues. Emergency support is available for urgent safety or security concerns.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preferences</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.preferences.currency}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, currency: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      >
                        <option value="AED">AED - UAE Dirham</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.preferences.timezone}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, timezone: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      >
                        <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                        <option value="Europe/London">Europe/London (GMT+0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center space-x-2 px-6 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
