'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, Plus, Calendar, MessageSquare, Star, DollarSign, 
  TrendingUp, TrendingDown, Users, Eye, Settings, 
  AlertCircle, CheckCircle, Clock, Filter, Download
} from 'lucide-react';
import { Host, HostAnalytics, HostBooking, PropertyListing, HostPerformance } from '@/lib/types/host';
import Button from '../ui/Button';

interface HostDashboardProps {
  hostId: string;
  onAddProperty?: () => void;
  onManageCalendar?: () => void;
  onViewMessages?: () => void;
  onHostSettings?: () => void;
  onViewAllBookings?: () => void;
}

const HostDashboard: React.FC<HostDashboardProps> = ({ 
  hostId, 
  onAddProperty,
  onManageCalendar,
  onViewMessages,
  onHostSettings,
  onViewAllBookings
}) => {
  const [analytics, setAnalytics] = useState<HostAnalytics | null>(null);
  const [recentBookings, setRecentBookings] = useState<HostBooking[]>([]);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [performance, setPerformance] = useState<HostPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock data - in a real app, this would come from APIs
  const mockAnalytics: HostAnalytics = {
    period: selectedPeriod,
    bookings: {
      total: 24,
      completed: 22,
      cancelled: 2,
      pending: 3,
      occupancyRate: 78
    },
    revenue: {
      totalEarnings: 45600,
      averageBookingValue: 1900,
      monthlyGrowth: 12.5,
      platformFees: 4560,
      netEarnings: 41040
    },
    guests: {
      totalGuests: 52,
      repeatGuests: 8,
      averageRating: 4.7,
      totalReviews: 45
    },
    properties: {
      totalProperties: 3,
      activeProperties: 3,
      averageOccupancy: 78,
      topPerformingProperty: 'Luxury Apartment in Downtown Dubai'
    }
  };

  const mockRecentBookings: HostBooking[] = [
    {
      id: 'booking-1',
      propertyId: 'property-1',
      propertyTitle: 'Luxury Apartment in Downtown Dubai',
      guestId: 'guest-1',
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.johnson@email.com',
      guestPhone: '+971 50 123 4567',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      guests: 2,
      status: 'confirmed',
      totalAmount: 1350,
      hostEarnings: 1215,
      platformFee: 135,
      cleaningFee: 100,
      serviceFee: 0,
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
      specialRequests: 'Late check-in requested',
      cancellationPolicy: 'Moderate',
      paymentStatus: 'paid'
    },
    {
      id: 'booking-2',
      propertyId: 'property-2',
      propertyTitle: 'Beachfront Villa on Palm Jumeirah',
      guestId: 'guest-2',
      guestName: 'Ahmed Al-Rashid',
      guestEmail: 'ahmed.rashid@email.com',
      checkIn: '2024-02-20',
      checkOut: '2024-02-25',
      guests: 4,
      status: 'pending',
      totalAmount: 3750,
      hostEarnings: 3375,
      platformFee: 375,
      cleaningFee: 200,
      serviceFee: 0,
      createdAt: '2024-01-22T14:15:00Z',
      updatedAt: '2024-01-22T14:15:00Z',
      cancellationPolicy: 'Strict',
      paymentStatus: 'pending'
    }
  ];

  const mockProperties: PropertyListing[] = [
    {
      id: 'property-1',
      hostId: hostId,
      title: 'Luxury Apartment in Downtown Dubai',
      description: 'Experience the vibrant energy of downtown Dubai in this beautifully designed modern apartment.',
      type: 'apartment',
      propertyType: 'entire_place',
      location: {
        address: 'Downtown Dubai',
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'UAE',
        lat: 25.1972,
        lng: 55.2744
      },
      capacity: {
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        beds: 2
      },
      amenities: [],
      houseRules: [],
      pricing: {
        basePrice: 450,
        currency: 'AED'
      },
      availability: {
        minimumStay: 1,
        advanceBookingLimit: 365,
        checkInTime: '15:00',
        checkOutTime: '11:00',
        instantBook: true
      },
      photos: [],
      status: 'approved',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ];

  const mockPerformance: HostPerformance[] = [
    {
      propertyId: 'property-1',
      propertyTitle: 'Luxury Apartment in Downtown Dubai',
      metrics: {
        occupancyRate: 85,
        averageRating: 4.8,
        totalBookings: 18,
        revenue: 32400,
        cancellationRate: 5,
        responseRate: 100,
        responseTime: 'within an hour'
      },
      period: '2024-01',
      comparison: {
        previousPeriod: {
          occupancyRate: 72,
          revenue: 28800,
          bookings: 15
        },
        growth: {
          occupancyRate: 18,
          revenue: 12.5,
          bookings: 20
        }
      }
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setRecentBookings(mockRecentBookings);
      setProperties(mockProperties);
      setPerformance(mockPerformance);
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Host Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your properties and track your performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Button
                variant="primary"
                onClick={onAddProperty}
                className="flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Property</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  AED {analytics?.revenue.totalEarnings.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{analytics?.revenue.monthlyGrowth}% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.bookings.occupancyRate}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {analytics?.bookings.total} total bookings
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.guests.averageRating}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {analytics?.guests.totalReviews} reviews
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Properties</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.properties.activeProperties}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  of {analytics?.properties.totalProperties} total
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Bookings
                  </h2>
                  <Button variant="secondary" size="sm" onClick={onViewAllBookings}>
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {booking.propertyTitle}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p><strong>{booking.guestName}</strong> • {booking.guests} guests</p>
                          <p>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          AED {booking.totalAmount}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Earnings: AED {booking.hostEarnings}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={onAddProperty}
                  className="w-full justify-start"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Add New Property
                </Button>
                <Button
                  variant="secondary"
                  onClick={onManageCalendar}
                  className="w-full justify-start"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Manage Calendar
                </Button>
                <Button
                  variant="secondary"
                  onClick={onViewMessages}
                  className="w-full justify-start"
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Messages
                </Button>
                <Button
                  variant="secondary"
                  onClick={onHostSettings}
                  className="w-full justify-start"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Host Settings
                </Button>
              </div>
            </div>

            {/* Property Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Property Performance
              </h2>
              <div className="space-y-4">
                {performance.map((prop) => (
                  <div key={prop.propertyId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {prop.propertyTitle}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Occupancy</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {prop.metrics.occupancyRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Rating</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {prop.metrics.averageRating} ⭐
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Bookings</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {prop.metrics.totalBookings}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Revenue</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          AED {prop.metrics.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
