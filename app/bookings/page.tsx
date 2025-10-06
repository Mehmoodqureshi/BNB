'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  Calendar, MapPin, Star, Clock, Search, Filter, 
  ChevronLeft, ChevronRight, Eye, MessageCircle, Heart
} from 'lucide-react';

const BookingsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/test-auth');
    return null;
  }

  // Mock booking data
  const bookings = {
    upcoming: [
      {
        id: '1',
        property: {
          title: 'Luxury Apartment in Downtown Dubai',
          location: 'Downtown Dubai, Dubai',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
          rating: 4.8,
          reviewCount: 124
        },
        checkIn: '2024-02-15',
        checkOut: '2024-02-18',
        guests: 2,
        totalPrice: 1350,
        currency: 'AED',
        status: 'confirmed',
        bookingDate: '2024-01-15'
      },
      {
        id: '2',
        property: {
          title: 'Beachfront Villa in Palm Jumeirah',
          location: 'Palm Jumeirah, Dubai',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
          rating: 4.9,
          reviewCount: 89
        },
        checkIn: '2024-03-01',
        checkOut: '2024-03-05',
        guests: 4,
        totalPrice: 4800,
        currency: 'AED',
        status: 'confirmed',
        bookingDate: '2024-01-20'
      }
    ],
    past: [
      {
        id: '3',
        property: {
          title: 'Modern Penthouse in Marina',
          location: 'Dubai Marina, Dubai',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
          rating: 4.7,
          reviewCount: 156
        },
        checkIn: '2023-12-10',
        checkOut: '2023-12-15',
        guests: 2,
        totalPrice: 4000,
        currency: 'AED',
        status: 'completed',
        bookingDate: '2023-11-15'
      }
    ],
    cancelled: []
  };

  const currentBookings = bookings[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-white/20 dark:border-gray-700/50">
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your reservations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { key: 'upcoming', label: 'Upcoming', count: bookings.upcoming.length },
              { key: 'past', label: 'Past', count: bookings.past.length },
              { key: 'cancelled', label: 'Cancelled', count: bookings.cancelled.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#006699] text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="font-medium">{tab.label}</span>
                <span className="text-xs bg-white/20 dark:bg-gray-600/20 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {currentBookings.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 dark:border-gray-700/50 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No {activeTab} bookings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming bookings yet."
                  : activeTab === 'past'
                  ? "You haven't completed any bookings yet."
                  : "You haven't cancelled any bookings."
                }
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
              >
                Start Booking
              </button>
            </div>
          ) : (
            currentBookings.map((booking) => (
              <div key={booking.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Image */}
                  <div className="lg:w-80">
                    <img
                      src={booking.property.image}
                      alt={booking.property.title}
                      className="w-full h-48 lg:h-40 object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {booking.property.title}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{booking.property.location}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="text-sm font-medium">{booking.property.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({booking.property.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {booking.totalPrice} {booking.currency}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Dates and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-[#006699]" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Check-in</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-[#006699]" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Check-out</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-[#006699]" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Status</div>
                          <div className={`text-sm font-medium ${
                            booking.status === 'confirmed' 
                              ? 'text-green-600 dark:text-green-400'
                              : booking.status === 'completed'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>Message Host</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>Add to Wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
