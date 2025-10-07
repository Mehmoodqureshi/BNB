'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, ChevronLeft, Search, Filter, Download, 
  Calendar, TrendingUp, TrendingDown, DollarSign, RefreshCw
} from 'lucide-react';
import { Transaction } from '@/lib/types/payments';
import TransactionCard from './TransactionCard';

const TransactionHistory: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'payment' | 'refund' | 'commission'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'succeeded' | 'failed' | 'pending' | 'refunded'>('all');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/test-auth');
    return null;
  }

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: 'txn_1',
      amount: 135000, // AED 1,350.00
      currency: 'aed',
      status: 'succeeded',
      type: 'payment',
      description: 'Luxury Apartment in Downtown Dubai',
      payment_method_id: 'pm_1',
      booking_id: 'bk_1',
      property_id: 'prop_1',
      guest_id: user.id,
      fees: {
        service_fee: 4050,
        processing_fee: 2700,
        platform_commission: 13500
      },
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      receipt_url: 'https://example.com/receipt1.pdf'
    },
    {
      id: 'txn_2',
      amount: 480000, // AED 4,800.00
      currency: 'aed',
      status: 'succeeded',
      type: 'payment',
      description: 'Beachfront Villa in Palm Jumeirah',
      payment_method_id: 'pm_1',
      booking_id: 'bk_2',
      property_id: 'prop_2',
      guest_id: user.id,
      fees: {
        service_fee: 14400,
        processing_fee: 9600,
        platform_commission: 48000
      },
      created_at: '2024-01-10T14:20:00Z',
      updated_at: '2024-01-10T14:20:00Z',
      receipt_url: 'https://example.com/receipt2.pdf'
    },
    {
      id: 'txn_3',
      amount: 400000, // AED 4,000.00
      currency: 'aed',
      status: 'refunded',
      type: 'refund',
      description: 'Refund for Modern Penthouse in Marina',
      payment_method_id: 'pm_1',
      booking_id: 'bk_3',
      property_id: 'prop_3',
      guest_id: user.id,
      fees: {
        service_fee: 0,
        processing_fee: 0,
        platform_commission: 0
      },
      created_at: '2023-12-20T16:45:00Z',
      updated_at: '2023-12-22T09:15:00Z'
    },
    {
      id: 'txn_4',
      amount: 50000, // AED 500.00
      currency: 'aed',
      status: 'failed',
      type: 'payment',
      description: 'Cozy Apartment in JBR',
      payment_method_id: 'pm_2',
      booking_id: 'bk_4',
      property_id: 'prop_4',
      guest_id: user.id,
      fees: {
        service_fee: 1500,
        processing_fee: 1000,
        platform_commission: 5000
      },
      created_at: '2023-12-15T11:20:00Z',
      updated_at: '2023-12-15T11:25:00Z',
      failure_reason: 'Insufficient funds'
    }
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedFilter === 'all' || transaction.type === selectedFilter;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate summary statistics
  const totalSpent = transactions
    .filter(t => t.type === 'payment' && t.status === 'succeeded')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalRefunded = transactions
    .filter(t => t.type === 'refund' && t.status === 'succeeded')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleViewDetails = (transactionId: string) => {
    console.log('View transaction details:', transactionId);
    // In a real app, this would open a modal or navigate to details page
  };

  const handleDownloadReceipt = (transactionId: string) => {
    console.log('Download receipt for:', transactionId);
    // In a real app, this would trigger receipt download
  };

  const handleRequestRefund = (transactionId: string) => {
    console.log('Request refund for:', transactionId);
    // In a real app, this would open refund request modal
  };

  const handleExportTransactions = () => {
    console.log('Export all transactions');
    // In a real app, this would generate and download a CSV/PDF
  };

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
                  <CreditCard className="h-6 w-6 text-[#006699] mr-2" />
                  Transaction History
                </h1>
                <p className="text-gray-600 dark:text-gray-400">View all your payment transactions</p>
              </div>
            </div>
            <button
              onClick={handleExportTransactions}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    AED {(totalSpent / 100).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Refunded</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    AED {(totalRefunded / 100).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {transactions.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="payment">Payments</option>
                  <option value="refund">Refunds</option>
                  <option value="commission">Commissions</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-12 shadow-xl border border-gray-200 dark:border-gray-700/50 text-center">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || selectedFilter !== 'all' || selectedStatus !== 'all'
                    ? "Try adjusting your search or filter criteria."
                    : "You haven't made any transactions yet."
                  }
                </p>
                {searchQuery || selectedFilter !== 'all' || selectedStatus !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setSelectedStatus('all');
                    }}
                    className="px-6 py-3 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
                  >
                    Start Booking
                  </button>
                )}
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onViewDetails={handleViewDetails}
                  onDownloadReceipt={handleDownloadReceipt}
                  onRequestRefund={handleRequestRefund}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
