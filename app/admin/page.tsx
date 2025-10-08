'use client';

import React, { useState } from 'react';
import { 
  Users, Home, Calendar, DollarSign, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Star, AlertTriangle, CheckCircle,
  Clock, Activity, Bell
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { PlatformStats, AdminAlert } from '@/lib/types/admin';
import { useAdminContext } from './layout';

const AdminDashboardPage: React.FC = () => {
  const { showAddPropertyModal } = useAdminContext();
  // Mock platform stats
  const [stats] = useState<PlatformStats>({
    overview: {
      totalUsers: 12453,
      totalHosts: 3421,
      totalGuests: 9032,
      activeUsers: 5678,
      newUsersToday: 34,
      userGrowthRate: 15.3,
    },
    properties: {
      totalProperties: 4521,
      activeProperties: 4234,
      pendingApproval: 23,
      inactiveProperties: 264,
      averageRating: 4.7,
      featuredProperties: 145,
    },
    bookings: {
      totalBookings: 28934,
      upcomingBookings: 1245,
      completedBookings: 26542,
      cancelledBookings: 1147,
      bookingsToday: 67,
      cancellationRate: 4.2,
    },
    revenue: {
      totalRevenue: 245600000, // AED 2.456M (in cents)
      revenueToday: 4520000, // AED 45.2k
      revenueThisMonth: 45600000, // AED 456k
      revenueLastMonth: 38400000, // AED 384k
      monthlyGrowth: 18.8,
      platformCommission: 29472000, // AED 294.7k
      averageBookingValue: 84900, // AED 849
    },
    payments: {
      totalTransactions: 29145,
      successfulPayments: 28312,
      failedPayments: 833,
      pendingRefunds: 18,
      processedRefunds: 423,
      chargebacks: 12,
    },
    reviews: {
      totalReviews: 18934,
      averageRating: 4.6,
      flaggedReviews: 8,
      pendingModeration: 3,
      reviewsToday: 45,
    },
  });

  const [alerts] = useState<AdminAlert[]>([
    {
      id: 'alert_1',
      type: 'warning',
      title: 'High Chargeback Rate',
      message: '12 chargebacks in last 7 days - above threshold of 5',
      action: { label: 'Review Cases', url: '/admin/disputes' },
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alert_2',
      type: 'info',
      title: 'Properties Pending Approval',
      message: '23 properties waiting for approval',
      action: { label: 'Review Queue', url: '/admin/properties' },
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 100).toLocaleString()}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Dashboard Overview" 
          subtitle="Platform performance and key metrics"
          onAddProperty={showAddPropertyModal}
        />

        <div className="p-8 space-y-8">
          {/* Alerts */}
          {alerts.filter(a => !a.isRead).length > 0 && (
            <div className="space-y-3">
              {alerts.filter(a => !a.isRead).map((alert) => {
                const alertStyles = {
                  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
                  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
                  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
                };
                
                return (
                  <div key={alert.id} className={`p-4 rounded-lg border ${alertStyles[alert.type]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                        </div>
                      </div>
                      {alert.action && (
                        <button 
                          onClick={() => window.location.href = alert.action!.url}
                          className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors text-sm font-medium"
                        >
                          {alert.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">+{stats.overview.userGrowthRate}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.overview.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                +{stats.overview.newUsersToday} today
              </p>
            </div>

            {/* Total Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Home className="h-6 w-6 text-white" />
                </div>
                {stats.properties.pendingApproval > 0 && (
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-semibold rounded-full">
                    {stats.properties.pendingApproval} pending
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Properties</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.properties.totalProperties.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {stats.properties.activeProperties.toLocaleString()} active
              </p>
            </div>

            {/* Total Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Activity className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600">{stats.bookings.bookingsToday} today</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.bookings.totalBookings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {stats.bookings.cancelledBookings} cancelled ({stats.bookings.cancellationRate}%)
              </p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">+{stats.revenue.monthlyGrowth}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.revenue.totalRevenue)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {formatCurrency(stats.revenue.revenueToday)} today
              </p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Commission Earned */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Platform Commission</h3>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(stats.revenue.platformCommission)}
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600" style={{ width: '78%' }}></div>
                </div>
                <span className="text-xs text-gray-500">This month</span>
              </div>
            </div>

            {/* Payment Success Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Success Rate</h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {((stats.payments.successfulPayments / stats.payments.totalTransactions) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.payments.failedPayments.toLocaleString()} failed, {stats.payments.chargebacks} chargebacks
              </p>
            </div>

            {/* Average Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Platform Rating</h3>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {stats.reviews.averageRating.toFixed(1)} / 5.0
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.reviews.totalReviews.toLocaleString()} total reviews
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 text-[#006699] mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New property approved</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Villa in Palm Jumeirah - 2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sarah Johnson - 5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Review flagged</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Inappropriate content - 12 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Large booking completed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">AED 12,500 - 18 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 text-[#006699] mr-2" />
                Pending Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/admin/properties'}
                  className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Properties to Review</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting approval</p>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{stats.properties.pendingApproval}</span>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/admin/refunds'}
                  className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Refund Requests</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pending approval</p>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{stats.payments.pendingRefunds}</span>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/admin/reviews'}
                  className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Flagged Reviews</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Need moderation</p>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{stats.reviews.flaggedReviews}</span>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/admin/disputes'}
                  className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Open Disputes</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Requires attention</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">12</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend (This Month)</h3>
            <div className="grid grid-cols-7 gap-2 h-48">
              {[65, 78, 82, 90, 85, 95, 88].map((height, index) => (
                <div key={index} className="flex flex-col justify-end items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-[#006699] to-[#0088cc] rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${height}%` }}
                  ></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">This Month</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.revenue.revenueThisMonth)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 dark:text-gray-400">Last Month</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(stats.revenue.revenueLastMonth)}</p>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">+{stats.revenue.monthlyGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all text-left"
            >
              <Users className="h-6 w-6 text-[#006699] mb-2" />
              <p className="font-semibold text-gray-900 dark:text-white">Manage Users</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">View and edit all users</p>
            </button>

            <button 
              onClick={() => window.location.href = '/admin/properties'}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all text-left"
            >
              <Home className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-semibold text-gray-900 dark:text-white">Approve Properties</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stats.properties.pendingApproval} waiting</p>
            </button>

            <button 
              onClick={() => window.location.href = '/admin/payments'}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all text-left"
            >
              <DollarSign className="h-6 w-6 text-green-600 mb-2" />
              <p className="font-semibold text-gray-900 dark:text-white">Monitor Payments</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">View all transactions</p>
            </button>

            <button 
              onClick={() => window.location.href = '/admin/analytics'}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all text-left"
            >
              <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900 dark:text-white">View Analytics</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Detailed reports</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
