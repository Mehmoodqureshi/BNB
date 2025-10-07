'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, Plus, Calendar, MessageSquare, Star, DollarSign, 
  TrendingUp, TrendingDown, Users, Eye, Settings, 
  AlertCircle, CheckCircle, Clock, Filter, Download,
  BarChart3, Activity, ArrowUpRight, ArrowDownRight,
  Award, Target, Zap, ChevronRight
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
  onViewPayouts?: () => void;
}

const HostDashboard: React.FC<HostDashboardProps> = ({ 
  hostId, 
  onAddProperty,
  onManageCalendar,
  onViewMessages,
  onHostSettings,
  onViewAllBookings,
  onViewPayouts
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699]/20 border-t-[#006699] mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-[#006699]/40 animate-ping mx-auto"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] rounded-2xl p-8 shadow-xl border border-[#006699]/10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">
                    Host Dashboard
                  </h1>
                </div>
                <p className="text-blue-100 text-lg">
                  Welcome back! Here's what's happening with your properties today.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="pl-4 pr-10 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent text-white font-medium appearance-none cursor-pointer hover:bg-white/20 transition-all duration-200"
                  >
                    <option value="week" className="text-gray-900 dark:text-gray-100 dark:bg-gray-800">This Week</option>
                    <option value="month" className="text-gray-900 dark:text-gray-100 dark:bg-gray-800">This Month</option>
                    <option value="quarter" className="text-gray-900 dark:text-gray-100 dark:bg-gray-800">This Quarter</option>
                    <option value="year" className="text-gray-900 dark:text-gray-100 dark:bg-gray-800">This Year</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white rotate-90 pointer-events-none" />
                </div>
                <Button 
                  variant="primary"
                  onClick={onAddProperty}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#006699] to-[#0088cc] dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 text-white dark:text-blue-400 hover:from-[#005588] hover:to-[#007799] dark:hover:bg-gray-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold px-6 py-3 border border-[#006699]/20 dark:border-gray-600"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Property</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings Card */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/30">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <ArrowUpRight className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                    +{analytics?.revenue.monthlyGrowth}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  AED {analytics?.revenue.totalEarnings.toLocaleString()}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Net: AED {analytics?.revenue.netEarnings.toLocaleString()}
                  </span>
                  <Activity className="h-4 w-4 text-green-500" />
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(analytics?.revenue.monthlyGrowth || 0 * 5, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Occupancy Rate Card */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Target className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Target: 80%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics?.bookings.occupancyRate}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {analytics?.bookings.total} bookings ({analytics?.bookings.completed} completed)
                </p>
              </div>
              {/* Circular Progress */}
              <div className="mt-4 flex items-center justify-between">
                <div className="relative h-12 w-12">
                  <svg className="transform -rotate-90 h-12 w-12">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - (analytics?.bookings.occupancyRate || 0) / 100)}`}
                      className="text-blue-500 transition-all duration-1000"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{analytics?.bookings.pending}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Average Rating Card */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg shadow-yellow-500/30">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= Math.floor(analytics?.guests.averageRating || 0)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics?.guests.averageRating} <span className="text-lg text-gray-400">/ 5.0</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Based on {analytics?.guests.totalReviews} reviews
                </p>
              </div>
              {/* Rating Distribution */}
              <div className="mt-4 space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Properties Card */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    All Active
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Properties</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {analytics?.properties.activeProperties}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  of {analytics?.properties.totalProperties} total properties
                </p>
              </div>
              {/* Stats Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg. Occupancy</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{analytics?.properties.averageOccupancy}%</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Top Performer</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">Downtown</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Quick Actions & Property Performance */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-gradient-to-br from-[#006699] to-[#0088cc] rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={onAddProperty}
                  className="group w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#006699] to-[#0088cc] hover:from-[#005588] hover:to-[#006699] rounded-xl text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Add New Property</span>
                  </div>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={onManageCalendar}
                  className="group w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Manage Calendar</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={onViewMessages}
                  className="group w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Messages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">3</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                <button
                  onClick={onViewPayouts}
                  className="group w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Earnings & Payouts</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={onHostSettings}
                  className="group w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                      <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Host Settings</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Enhanced Property Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Property Performance
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Top performers this month</p>
                </div>
              </div>
              <div className="space-y-4">
                {performance.map((prop, index) => (
                  <div key={prop.propertyId} className="relative group">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      {/* Rank Badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        #{index + 1}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pt-2">
                        {prop.propertyTitle}
                      </h3>
                      
                      <div className="space-y-3">
                        {/* Occupancy */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Occupancy</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{prop.metrics.occupancyRate}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                              style={{ width: `${prop.metrics.occupancyRate}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <Star className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{prop.metrics.averageRating}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{prop.metrics.totalBookings}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Bookings</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-500 mx-auto mb-1" />
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{(prop.metrics.revenue / 1000).toFixed(0)}k</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                          </div>
                        </div>
                        
                        {/* Growth Indicator */}
                        {prop.comparison && (
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400">vs last month</span>
                            <div className="flex items-center space-x-1">
                              <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                +{prop.comparison.growth.revenue}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-blue-900/10 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#006699] rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Bookings
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Latest reservations and updates
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={onViewAllBookings}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-[#006699] hover:text-white dark:hover:text-white transition-all duration-200"
                  >
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="group relative p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-[#006699]/30 transition-all duration-300"
                    >
                      {/* Accent bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                        booking.status === 'confirmed' ? 'bg-green-500' :
                        booking.status === 'pending' ? 'bg-yellow-500' :
                        booking.status === 'completed' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}></div>
                      
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-gradient-to-br from-[#006699] to-[#0088cc] rounded-lg">
                              <Home className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#006699] dark:group-hover:text-blue-400 transition-colors">
                                {booking.propertyTitle}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)} mt-1`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1.5 capitalize">{booking.status}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="ml-11 space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-white">{booking.guestName}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 dark:text-gray-400">{booking.guests} guests</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span>→</span>
                              <span>{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            
                            {booking.specialRequests && (
                              <div className="flex items-start space-x-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-400">{booking.specialRequests}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              AED {booking.totalAmount.toLocaleString()}
                            </p>
                          </div>
                          <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Your Earnings</p>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                              AED {booking.hostEarnings.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {recentBookings.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No recent bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
