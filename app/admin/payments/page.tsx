'use client';

import React, { useState } from 'react';
import { 
  Search, DollarSign, TrendingUp, TrendingDown, Download,
  CreditCard, CheckCircle, XCircle, Clock, Filter
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';

interface Transaction {
  id: string;
  transactionId: string;
  type: 'booking_payment' | 'host_payout' | 'refund' | 'commission';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  from: string;
  to: string;
  description: string;
  paymentMethod: string;
  createdAt: string;
}

const AdminPaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock transactions data
  const [transactions] = useState<Transaction[]>([
    {
      id: 'txn_1',
      transactionId: 'TXN-2024-001',
      type: 'booking_payment',
      amount: 85000,
      currency: 'AED',
      status: 'completed',
      from: 'Sarah Johnson',
      to: 'Platform',
      description: 'Booking payment for Dubai Marina Apartment',
      paymentMethod: 'Visa ****4242',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'txn_2',
      transactionId: 'TXN-2024-002',
      type: 'host_payout',
      amount: 65000,
      currency: 'AED',
      status: 'completed',
      from: 'Platform',
      to: 'Mohammed Al-Zahra',
      description: 'Payout for completed booking',
      paymentMethod: 'Bank Transfer',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_3',
      transactionId: 'TXN-2024-003',
      type: 'refund',
      amount: 12000,
      currency: 'AED',
      status: 'processing',
      from: 'Platform',
      to: 'Emily Chen',
      description: 'Refund for cancelled booking',
      paymentMethod: 'Visa ****1234',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_4',
      transactionId: 'TXN-2024-004',
      type: 'commission',
      amount: 15000,
      currency: 'AED',
      status: 'completed',
      from: 'Platform',
      to: 'Platform Revenue',
      description: 'Platform commission from booking',
      paymentMethod: 'Internal',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = searchQuery === '' || 
      txn.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking_payment':
        return <CreditCard className="h-5 w-5 text-green-600" />;
      case 'host_payout':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'refund':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'commission':
        return <DollarSign className="h-5 w-5 text-purple-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${(amount / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate stats
  const totalRevenue = transactions
    .filter(t => t.type === 'booking_payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalPayouts = transactions
    .filter(t => t.type === 'host_payout' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCommission = transactions
    .filter(t => t.type === 'commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactions = transactions.filter(t => t.status === 'pending' || t.status === 'processing').length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Payment Management" 
          subtitle="Monitor all financial transactions"
          actions={
            <Button variant="primary" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          }
        />

        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-md border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">
                    {formatCurrency(totalRevenue, 'AED')}
                  </p>
                  <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 shadow-md border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Payouts</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-white mt-1">
                    {formatCurrency(totalPayouts, 'AED')}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">To hosts</p>
                </div>
                <DollarSign className="h-10 w-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-md border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Commission</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">
                    {formatCurrency(totalCommission, 'AED')}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Platform earnings</p>
                </div>
                <CheckCircle className="h-10 w-10 text-purple-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 shadow-md border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-white mt-1">{pendingTransactions}</p>
                  <p className="text-xs text-yellow-600 mt-1">Awaiting processing</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by transaction ID or user..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="booking_payment">Booking Payments</option>
                <option value="host_payout">Host Payouts</option>
                <option value="refund">Refunds</option>
                <option value="commission">Commission</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      From / To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{txn.transactionId}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{txn.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(txn.type)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {txn.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white">From: {txn.from}</p>
                          <p className="text-gray-500 dark:text-gray-400">To: {txn.to}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(txn.amount, txn.currency)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{txn.paymentMethod}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(txn.status)}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(txn.createdAt)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-[#006699] text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPaymentsPage;
