'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useUserProfile } from '@/lib/auth/authService';
import { useRouter } from 'next/navigation';
import { 
  User, Settings, Calendar, MessageSquare, Heart, Star, Shield, Camera, 
  MapPin, Clock, TrendingUp, Award, Bell, CreditCard, Globe, 
  ChevronRight, Plus, Search, Filter, HelpCircle, DollarSign
} from 'lucide-react';
import UserProfileModal from '@/components/auth/UserProfileModal';
import RefundCalculatorModal from '@/components/payments/RefundCalculatorModal';

const DashboardPage: React.FC = () => {
  const { user: localUser, isAuthenticated, isLoading: authLoading, uploadProfilePicture } = useAuth();
  const { data: profileData, isLoading: profileLoading, error: profileError, refetch } = useUserProfile();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to load profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{(profileError as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !localUser) {
    router.push('/');
    return null;
  }

  // Merge local user data with API profile data
  const user = profileData ? {
    ...localUser,
    ...profileData,
    // Ensure proper structure
    firstName: profileData.firstName || profileData.name?.split(' ')[0] || localUser.firstName || '',
    lastName: profileData.lastName || profileData.name?.split(' ').slice(1).join(' ') || localUser.lastName || '',
    stats: profileData.stats || localUser.stats || {
      totalBookings: 0,
      totalReviews: 0,
      averageRating: 0,
      yearsHosting: 0
    },
    profilePicture: profileData.profilePicture || localUser.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  } : localUser;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📁 Dashboard: File selected:', file);
    
    if (!file) {
      console.log('❌ Dashboard: No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Dashboard: Invalid file type:', file.type);
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      console.log('❌ Dashboard: File too large:', file.size);
      alert('File size must be less than 2MB');
      return;
    }

    console.log('✅ Dashboard: File validation passed, creating preview...');

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('🖼️ Dashboard: Preview created:', result.substring(0, 50) + '...');
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      console.log('📤 Dashboard: Starting upload...');
      const imageUrl = await uploadProfilePicture(file);
      console.log('✅ Dashboard: Photo uploaded successfully:', imageUrl);
      // Clear preview after successful upload
      setPreviewImage(null);
    } catch (error) {
      console.error('❌ Dashboard: Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      {/* Glassy Header */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-gray-200 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={previewImage || user.profilePicture}
                  alt={user.firstName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <label className="absolute -bottom-1 -right-1 p-1 bg-[#006699] text-white rounded-full hover:bg-[#005588] transition-colors cursor-pointer">
                  <Camera className="h-3 w-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.stats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.stats.totalReviews} reviews
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats.totalBookings}</p>
              </div>
              <div className="p-3 bg-[#006699]/10 rounded-lg">
                <Calendar className="h-6 w-6 text-[#006699]" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviews</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats.totalReviews}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Years Hosting</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats.yearsHosting}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile & Quick Actions */}
          <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={previewImage || user.profilePicture}
                    alt={user.firstName}
                    className="h-20 w-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <label className="absolute -bottom-1 -right-1 p-2 bg-[#006699] text-white rounded-full hover:bg-[#005588] transition-colors cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{user.email}</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  
                </div>
              </div>
            </div>

              {/* Verification Status */}
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-[#006699] mr-2" />
                Verification Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Email</span>
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${
                    user.isEmailVerified 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      user.isEmailVerified ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span>{user.isEmailVerified ? 'Verified' : 'Not verified'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Phone</span>
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${
                    user.isPhoneVerified 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      user.isPhoneVerified ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span>{user.isPhoneVerified ? 'Verified' : 'Not verified'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Emirate ID</span>
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded text-xs ${
                    user.emirateID 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      user.emirateID ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span>{user.emirateID ? 'Verified' : 'Not verified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Features */}
          <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-[#006699]/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-[#006699]" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Book a Stay</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Find your next adventure</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => router.push('/wishlist')}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Wishlist</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Saved properties</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => router.push('/messages')}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Messages</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Chat with hosts</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => router.push('/payments')}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Payment Methods</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your cards</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => router.push('/reviews')}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Reviews & Ratings</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View and leave reviews</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => setShowRefundModal(true)}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Refund Calculator</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check cancellation refunds</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => router.push('/support')}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Customer Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get help & submit complaints</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button 
                  onClick={() => router.push('/settings')}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Settings</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Account preferences</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>
              </div>
            </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-[#006699]/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-[#006699]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">New booking confirmed</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2 days ago</p>
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">+AED 150</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">New review received</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">5 days ago</p>
                  </div>
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">5.0</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">New message from host</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 week ago</p>
                  </div>
                  <div className="w-2 h-2 bg-[#006699] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Refund Calculator Modal */}
      <RefundCalculatorModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
      />
    </div>
  );
};

export default DashboardPage;
