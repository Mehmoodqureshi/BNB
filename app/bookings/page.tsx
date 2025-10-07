'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  Calendar, MapPin, Star, Clock, Search, Filter, 
  ChevronLeft, ChevronRight, Eye, MessageCircle, Heart, DollarSign, StarOff
} from 'lucide-react';
import { calculateRefundAmount, formatCurrency } from '@/lib/services/paymentCalculations';

const BookingsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showRefundInfo, setShowRefundInfo] = useState<string | null>(null);
  const [reviewedBookings, setReviewedBookings] = useState<string[]>(['3']); // Mock: booking 3 already reviewed

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
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

  // Mock booking data (using current dates)
  const today = new Date();
  const futureDate1 = new Date(today);
  futureDate1.setDate(today.getDate() + 15); // 15 days from now
  const futureDate2 = new Date(today);
  futureDate2.setDate(today.getDate() + 30); // 30 days from now
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 60); // 60 days ago

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
        checkIn: futureDate1.toISOString().split('T')[0],
        checkOut: new Date(futureDate1.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 2,
        totalPrice: 1350,
        currency: 'AED',
        status: 'confirmed',
        bookingDate: today.toISOString().split('T')[0],
        cancellationPolicy: 'moderate' as const
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
        checkIn: futureDate2.toISOString().split('T')[0],
        checkOut: new Date(futureDate2.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 4,
        totalPrice: 4800,
        currency: 'AED',
        status: 'confirmed',
        bookingDate: today.toISOString().split('T')[0],
        cancellationPolicy: 'flexible' as const
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
        checkIn: pastDate.toISOString().split('T')[0],
        checkOut: new Date(pastDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 2,
        totalPrice: 4000,
        currency: 'AED',
        status: 'completed',
        bookingDate: new Date(pastDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cancellationPolicy: 'strict' as const
      }
    ],
    cancelled: []
  };

  const currentBookings = bookings[activeTab];

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
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50 mb-8">
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
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-12 shadow-xl border border-gray-200 dark:border-gray-700/50 text-center">
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
              <div key={booking.id} className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
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
                          {booking.currency} {booking.totalPrice.toLocaleString()}
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
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>Message Host</span>
                      </button>
                      {activeTab === 'upcoming' && (
                        <button 
                          onClick={() => setShowRefundInfo(showRefundInfo === booking.id ? null : booking.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <DollarSign className="h-4 w-4" />
                          <span>Check Refund</span>
                        </button>
                      )}
                      {activeTab === 'past' && !reviewedBookings.includes(booking.id) && (
                        <button 
                          onClick={() => router.push(`/reviews?bookingId=${booking.id}`)}
                          className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                        >
                          <Star className="h-4 w-4" />
                          <span>Leave Review</span>
                        </button>
                      )}
                      {activeTab === 'past' && reviewedBookings.includes(booking.id) && (
                        <button 
                          onClick={() => router.push('/reviews')}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <Star className="h-4 w-4 fill-current" />
                          <span>View Your Review</span>
                        </button>
                      )}
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>Add to Wishlist</span>
                      </button>
                    </div>

                    {/* Refund Information */}
                    {showRefundInfo === booking.id && activeTab === 'upcoming' && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        {(() => {
                          const refund = calculateRefundAmount(
                            booking.totalPrice * 100,
                            new Date(booking.checkIn),
                            booking.cancellationPolicy || 'moderate'
                          );
                          return (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Cancellation Refund</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  refund.isEligible 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {refund.refundPercentage}% Refund
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">If cancelled today:</p>
                                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(refund.refundAmount, 'AED')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Penalty:</p>
                                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                    {formatCurrency(refund.penaltyAmount, 'AED')}
                                  </p>
                                </div>
                              </div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                                  style={{ width: `${refund.refundPercentage}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {refund.reason}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                Policy: {(booking.cancellationPolicy || 'moderate').charAt(0).toUpperCase() + (booking.cancellationPolicy || 'moderate').slice(1)}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
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
