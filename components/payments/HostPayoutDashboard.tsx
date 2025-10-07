'use client';

import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle,
  Calendar, Download, Eye, Filter, ArrowRight, Wallet
} from 'lucide-react';
import { PayoutSchedule, HostEarnings, formatCurrency } from '@/lib/services/paymentCalculations';
import Button from '../ui/Button';

interface HostPayoutDashboardProps {
  hostId: string;
}

const HostPayoutDashboard: React.FC<HostPayoutDashboardProps> = ({ hostId }) => {
  // Mock data - in real app, would come from API
  const [payoutSchedules] = useState<PayoutSchedule[]>([
    {
      bookingId: 'bk_1',
      checkInDate: new Date('2024-02-15'),
      amount: 121500, // AED 1,215.00
      releaseDate: new Date('2024-02-15T15:00:00'),
      status: 'held',
      daysUntilRelease: 10,
    },
    {
      bookingId: 'bk_2',
      checkInDate: new Date('2024-02-10'),
      amount: 337500, // AED 3,375.00
      releaseDate: new Date('2024-02-10T15:00:00'),
      status: 'pending_release',
      daysUntilRelease: 1,
    },
    {
      bookingId: 'bk_3',
      checkInDate: new Date('2024-01-25'),
      amount: 360000, // AED 3,600.00
      releaseDate: new Date('2024-01-25T15:00:00'),
      status: 'released',
      daysUntilRelease: -10,
    },
  ]);

  const [earnings] = useState<HostEarnings>({
    totalEarnings: 819000,
    totalBookings: 3,
    platformCommission: 98280,
    processingFees: 23751,
    netEarnings: 819000,
    pendingPayouts: 459000,
    releasedPayouts: 360000,
    averageBookingValue: 273000,
  });

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'held' | 'pending_release' | 'released'>('all');

  const filteredPayouts = selectedFilter === 'all' 
    ? payoutSchedules 
    : payoutSchedules.filter(p => p.status === selectedFilter);

  const getStatusColor = (status: PayoutSchedule['status']) => {
    switch (status) {
      case 'held':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'pending_release':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'released':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: PayoutSchedule['status']) => {
    switch (status) {
      case 'held':
        return <Clock className="h-4 w-4" />;
      case 'pending_release':
        return <AlertCircle className="h-4 w-4" />;
      case 'released':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">+12%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(earnings.totalEarnings, 'AED')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {earnings.totalBookings} bookings
          </p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending Payouts</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(earnings.pendingPayouts, 'AED')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Held until check-in
          </p>
        </div>

        {/* Released Payouts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Released Payouts</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(earnings.releasedPayouts, 'AED')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Available for transfer
          </p>
        </div>

        {/* Average Booking Value */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg. Booking Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(earnings.averageBookingValue, 'AED')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Per booking
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Payouts</option>
              <option value="held">Held (Escrowed)</option>
              <option value="pending_release">Pending Release</option>
              <option value="released">Released</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button variant="primary" size="sm" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Payout Schedule</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Payout Schedule List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payout Schedule</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your earnings and payout releases
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPayouts.length === 0 ? (
            <div className="p-12 text-center">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No payouts found</p>
            </div>
          ) : (
            filteredPayouts.map((payout) => (
              <div key={payout.bookingId} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                        {getStatusIcon(payout.status)}
                        <span className="ml-1.5 capitalize">{payout.status.replace('_', ' ')}</span>
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Booking ID: {payout.bookingId}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-in Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {payout.checkInDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Release Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {payout.releaseDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {payout.status === 'released' ? 'Released' : 'Time Until Release'}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {payout.status === 'released' ? '✓ Available' : `${payout.daysUntilRelease} day${payout.daysUntilRelease !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formatCurrency(payout.amount, 'AED')}
                    </p>
                    <Button variant="secondary" size="sm" className="flex items-center space-x-2">
                      <Eye className="h-3 w-3" />
                      <span>Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress bar for held funds */}
                {payout.status === 'held' && payout.daysUntilRelease > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>Funds held in escrow</span>
                      <span>{payout.daysUntilRelease} days until release</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${Math.max(0, 100 - (payout.daysUntilRelease * 5))}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-500 rounded-lg">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How Payouts Work
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Funds are held in escrow until guest check-in for security</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Payouts are released at 3:00 PM on check-in day</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Bank transfers typically arrive within 1-2 business days</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Platform commission ({((earnings.platformCommission / earnings.totalEarnings) * 100).toFixed(1)}%) and processing fees are automatically deducted</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostPayoutDashboard;

