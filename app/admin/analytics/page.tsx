'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Users, Home, Calendar, Star,
  ArrowUp, ArrowDown, Download
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';

const AdminAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = {
    totalRevenue: {
      value: 2345000,
      change: 15.3,
      trend: 'up' as const,
    },
    totalBookings: {
      value: 1234,
      change: 12.5,
      trend: 'up' as const,
    },
    activeUsers: {
      value: 5678,
      change: 8.2,
      trend: 'up' as const,
    },
    activeListings: {
      value: 432,
      change: -2.1,
      trend: 'down' as const,
    },
    avgBookingValue: {
      value: 19000,
      change: 5.7,
      trend: 'up' as const,
    },
    platformCommission: {
      value: 281400,
      change: 14.2,
      trend: 'up' as const,
    },
  };

  const revenueByMonth = [
    { month: 'Jan', revenue: 180000, bookings: 95 },
    { month: 'Feb', revenue: 195000, bookings: 102 },
    { month: 'Mar', revenue: 210000, bookings: 110 },
    { month: 'Apr', revenue: 225000, bookings: 118 },
    { month: 'May', revenue: 238000, bookings: 125 },
    { month: 'Jun', revenue: 252000, bookings: 132 },
  ];

  const topHosts = [
    { name: 'Mohammed Al-Zahra', earnings: 125000, bookings: 45, rating: 4.9 },
    { name: 'Sarah Johnson', earnings: 98000, bookings: 38, rating: 4.8 },
    { name: 'Ahmed Hassan', earnings: 87000, bookings: 35, rating: 4.7 },
    { name: 'Fatima Ahmed', earnings: 76000, bookings: 30, rating: 4.9 },
  ];

  const topProperties = [
    { name: 'Luxury Dubai Marina Apartment', bookings: 34, revenue: 289000, rating: 4.9 },
    { name: 'Palm Jumeirah Villa', bookings: 28, revenue: 350000, rating: 5.0 },
    { name: 'Downtown Studio', bookings: 45, revenue: 162000, rating: 4.6 },
    { name: 'Business Bay Penthouse', bookings: 22, revenue: 264000, rating: 4.8 },
  ];

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 100).toLocaleString()}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Analytics & Insights" 
          subtitle="Platform performance metrics and trends"
          actions={
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="primary" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          }
        />

        <div className="p-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-md border border-green-200 dark:border-green-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-white mt-2">
                    {formatCurrency(stats.totalRevenue.value)}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      +{stats.totalRevenue.change}% from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 shadow-md border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Bookings</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-white mt-2">
                    {stats.totalBookings.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-blue-600">
                      +{stats.totalBookings.change}% from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-md border border-purple-200 dark:border-purple-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Active Users</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-white mt-2">
                    {stats.activeUsers.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-sm font-medium text-purple-600">
                      +{stats.activeUsers.change}% from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Listings</p>
                <Home className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeListings.value}
              </p>
              <div className="flex items-center mt-2">
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">{stats.activeListings.change}%</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Booking Value</p>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.avgBookingValue.value)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{stats.avgBookingValue.change}%</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Platform Commission</p>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.platformCommission.value)}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{stats.platformCommission.change}%</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
            <div className="space-y-3">
              {revenueByMonth.map((item) => (
                <div key={item.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.month}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(item.revenue)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.bookings} bookings
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#006699] to-[#0088cc] h-2 rounded-full"
                        style={{ width: `${(item.revenue / 300000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Hosts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Hosts</h3>
              <div className="space-y-4">
                {topHosts.map((host, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-[#006699] to-[#0088cc] rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{host.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{host.bookings} bookings</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span>{host.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(host.earnings)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Properties</h3>
              <div className="space-y-4">
                {topProperties.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-[#006699] to-[#0088cc] rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{property.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{property.bookings} bookings</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span>{property.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(property.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalyticsPage;
