'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { RefundRequest } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

const AdminRefundsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Mock refund requests
  const [refunds, setRefunds] = useState<RefundRequest[]>([
    {
      id: 'ref_1',
      transactionId: 'txn_123',
      bookingId: 'bk_456',
      requestedBy: 'user_1',
      requesterName: 'Sarah Johnson',
      amount: 135000, // AED 1,350
      reason: 'requested_by_customer',
      description: 'Travel plans changed due to work emergency',
      status: 'pending',
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ref_2',
      transactionId: 'txn_124',
      bookingId: 'bk_457',
      requestedBy: 'user_2',
      requesterName: 'Mohammed Al-Zahra',
      amount: 480000, // AED 4,800
      reason: 'property_issue',
      description: 'Property was not as described in listing',
      status: 'pending',
      requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ref_3',
      transactionId: 'txn_125',
      bookingId: 'bk_458',
      requestedBy: 'user_3',
      requesterName: 'Emily Chen',
      amount: 75000, // AED 750
      reason: 'duplicate_payment',
      description: 'Payment was charged twice',
      status: 'approved',
      requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      processedBy: 'admin_1',
      adminNotes: 'Duplicate payment confirmed. Full refund issued.',
    },
  ]);

  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = searchQuery === '' || 
      refund.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (refundId: string) => {
    setRefunds(prev => 
      prev.map(r => r.id === refundId ? {
        ...r,
        status: 'approved' as const,
        processedAt: new Date().toISOString(),
        processedBy: 'admin_current',
        adminNotes,
      } : r)
    );
    setShowModal(false);
    setAdminNotes('');
    alert('Refund approved! Payment will be processed.');
  };

  const handleReject = (refundId: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setRefunds(prev => 
      prev.map(r => r.id === refundId ? {
        ...r,
        status: 'rejected' as const,
        processedAt: new Date().toISOString(),
        processedBy: 'admin_current',
        adminNotes,
      } : r)
    );
    setShowModal(false);
    setAdminNotes('');
    alert('Refund rejected. User will be notified.');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      processed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 100).toLocaleString()}`;
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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Refund Management" 
          subtitle="Review and process refund requests"
        />

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {refunds.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {refunds.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {refunds.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(refunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search refunds..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Refunds List */}
          <div className="space-y-4">
            {filteredRefunds.map((refund) => (
              <div key={refund.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {refund.requesterName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(refund.status)}`}>
                        {refund.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Refund ID</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{refund.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Booking ID</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{refund.bookingId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(refund.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Requested</p>
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(refund.requestedAt)}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reason</p>
                      <p className="text-sm text-gray-900 dark:text-white capitalize">{refund.reason.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{refund.description}</p>
                    </div>

                    {refund.adminNotes && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">Admin Notes</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{refund.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  {refund.status === 'pending' && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedRefund(refund);
                          setShowModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedRefund(refund);
                          setShowModal(true);
                        }}
                        className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRefunds.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No refund requests found</p>
            </div>
          )}
        </div>

        {/* Approval/Rejection Modal */}
        {showModal && selectedRefund && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-6 text-white">
                <h3 className="text-xl font-bold">Process Refund Request</h3>
                <p className="text-blue-100 text-sm">{formatCurrency(selectedRefund.amount)}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Requester</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedRefund.requesterName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedRefund.amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Reason</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedRefund.reason.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Requested</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedRefund.requestedAt)}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRefund.description}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(selectedRefund.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Refund
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleReject(selectedRefund.id)}
                    className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                
                <Button variant="secondary" onClick={() => setShowModal(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminRefundsPage;
