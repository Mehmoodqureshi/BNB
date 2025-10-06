'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Heart, 
  MessageCircle, 
  Settings, 
  Plus, 
  Home, 
  Star,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Shield,
  Award,
  TrendingUp,
  BarChart3,
  Bell,
  HelpCircle,
  X,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { clsx } from 'clsx';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'hosting' | 'messages' | 'account'>('overview');

  if (!isOpen || !user) return null;

  const mockBookings = [
    {
      id: '1',
      property: {
        title: 'Luxury Apartment in Downtown Dubai',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop',
        location: 'Downtown Dubai, Dubai'
      },
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      guests: 2,
      status: 'confirmed',
      total: 1350
    },
    {
      id: '2',
      property: {
        title: 'Beachfront Villa in Palm Jumeirah',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
        location: 'Palm Jumeirah, Dubai'
      },
      checkIn: '2024-03-10',
      checkOut: '2024-03-15',
      guests: 4,
      status: 'upcoming',
      total: 6000
    }
  ];

  const mockHostings = [
    {
      id: '1',
      property: {
        title: 'Modern Apartment in Marina',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop',
        location: 'Dubai Marina, Dubai'
      },
      nextBooking: '2024-02-20',
      totalBookings: 12,
      revenue: 15000,
      rating: 4.9
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'upcoming':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'completed':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-700';
      case 'cancelled':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'trips', label: 'Trips', icon: Calendar },
              { id: 'hosting', label: 'Hosting', icon: Home },
              { id: 'messages', label: 'Messages', icon: MessageCircle },
              { id: 'account', label: 'Account', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-[#006699] text-[#006699]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.stats.totalBookings}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-[#006699]" />
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.stats.averageRating}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Years Hosting</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.stats.yearsHosting}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.responseRate}%
                      </p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        New booking confirmed
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Luxury Apartment in Downtown Dubai - Feb 15-18
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        New message from guest
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Sarah M. asked about check-in time
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        New review received
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        5-star review for Modern Apartment in Marina
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Trips
                </h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#004466] transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Book a trip</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex space-x-4">
                      <img
                        src={booking.property.image}
                        alt={booking.property.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {booking.property.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.property.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {booking.guests} guests
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={clsx(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(booking.status)
                        )}>
                          {booking.status}
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                          AED {booking.total}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hosting' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Hosting
                </h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#004466] transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>List your space</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {mockHostings.map((hosting) => (
                  <div key={hosting.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex space-x-4">
                      <img
                        src={hosting.property.image}
                        alt={hosting.property.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {hosting.property.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {hosting.property.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Next booking: {new Date(hosting.nextBooking).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {hosting.rating} rating
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {hosting.totalBookings} bookings
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          AED {hosting.revenue}
                        </p>
                        <p className="text-xs text-gray-500">Total revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Messages
              </h3>
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No messages yet. Start a conversation with a host or guest!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Personal Information</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Profile</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Login & Security</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Payments & Payouts</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Preferences</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Notifications</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Privacy & Sharing</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Global Preferences</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
