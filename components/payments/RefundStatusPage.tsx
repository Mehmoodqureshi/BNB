'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  RefreshCw, ChevronLeft, Clock, CheckCircle, XCircle, 
  DollarSign, Calendar, FileText, Mail, Phone
} from 'lucide-react';
import { Refund } from '@/lib/types/payments';

const RefundStatusPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading refund status...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/test-auth');
    return null;
  }

  // Mock refund data
  const refunds: Refund[] = [
    {
      id: 'rf_1',
      transaction_id: 'txn_3',
      amount: 400000,
      currency: 'aed',
      status: 'succeeded',
      reason: 'requested_by_customer',
      description: 'Cancelled booking due to travel restrictions',
      created_at: '2023-12-20T16:45:00Z',
      processed_at: '2023-12-22T09:15:00Z',
      receipt_url: 'https://example.com/refund_receipt1.pdf'
    },
    {
      id: 'rf_2',
      transaction_id: 'txn_4',
      amount: 25000,
      currency: 'aed',
      status: 'pending',
      reason: 'duplicate',
      description: 'Payment was charged twice for the same booking',
      created_at: '2024-01-18T10:30:00Z'
    },
    {
      id: 'rf_3',
      transaction_id: 'txn_5',
      amount: 150000,
      currency: 'aed',
      status: 'failed',
      reason: 'requested_by_customer',
      description: 'Property was not as described',
      created_at: '2024-01-15T14:20:00Z',
      failure_reason: 'Original payment method is no longer available'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      default:
        return <RefreshCw className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'failed':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = (refund: Refund) => {
    switch (refund.status) {
      case 'succeeded':
        return {
          title: 'Refund Processed',
          message: `Your refund of ${formatAmount(refund.amount, refund.currency)} has been successfully processed and should appear in your account within 1-2 business days.`,
          icon: CheckCircle,
          color: 'text-green-600'
        };
      case 'failed':
        return {
          title: 'Refund Failed',
          message: `Unfortunately, we couldn't process your refund. ${refund.failure_reason || 'Please contact support for assistance.'}`,
          icon: XCircle,
          color: 'text-red-600'
        };
      case 'pending':
        return {
          title: 'Refund Pending',
          message: `Your refund request is being processed. You'll receive an email notification once it's complete, typically within 5-10 business days.`,
          icon: Clock,
          color: 'text-yellow-600'
        };
      default:
        return {
          title: 'Unknown Status',
          message: 'Please contact support for more information about this refund.',
          icon: RefreshCw,
          color: 'text-gray-600'
        };
    }
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
                  <RefreshCw className="h-6 w-6 text-[#006699] mr-2" />
                  Refund Status
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Track your refund requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {refunds.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-12 shadow-xl border border-gray-200 dark:border-gray-700/50 text-center">
              <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Refund Requests
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't requested any refunds yet.
              </p>
              <button
                onClick={() => router.push('/transaction-history')}
                className="px-6 py-3 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
              >
                View Transaction History
              </button>
            </div>
          ) : (
            refunds.map((refund) => {
              const statusInfo = getStatusMessage(refund);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={refund.id} className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                  {/* Refund Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <DollarSign className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Refund #{refund.id}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Transaction: {refund.transaction_id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {formatAmount(refund.amount, refund.currency)}
                        </div>
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(refund.status)}`}>
                          {getStatusIcon(refund.status)}
                          <span className="capitalize">{refund.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Status Message */}
                    <div className={`flex items-start space-x-4 p-4 rounded-lg border ${getStatusColor(refund.status)}`}>
                      <StatusIcon className={`h-6 w-6 ${statusInfo.color} mt-0.5 flex-shrink-0`} />
                      <div>
                        <h4 className={`font-semibold ${statusInfo.color}`}>
                          {statusInfo.title}
                        </h4>
                        <p className={`text-sm mt-1 ${statusInfo.color.replace('text-', 'text-').replace('-600', '-700')} dark:${statusInfo.color.replace('text-', 'text-').replace('-600', '-300')}`}>
                          {statusInfo.message}
                        </p>
                      </div>
                    </div>

                    {/* Refund Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Refund Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Reason</span>
                            <span className="text-gray-900 dark:text-white capitalize">
                              {refund.reason.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Requested</span>
                            <span className="text-gray-900 dark:text-white">
                              {formatDate(refund.created_at)}
                            </span>
                          </div>
                          {refund.processed_at && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Processed</span>
                              <span className="text-gray-900 dark:text-white">
                                {formatDate(refund.processed_at)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Description</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {refund.description || 'No additional details provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Failure Reason */}
                    {refund.failure_reason && (
                      <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Failure Reason</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">{refund.failure_reason}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                      <div className="flex items-center space-x-4">
                        {refund.receipt_url && (
                          <button className="flex items-center space-x-2 px-4 py-2 text-[#006699] hover:text-[#005588] hover:bg-[#006699]/10 rounded-lg transition-colors">
                            <FileText className="h-4 w-4" />
                            <span>Download Receipt</span>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Mail className="h-4 w-4" />
                          <span>Contact Support</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700/50">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Need Help with Your Refund?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have questions about your refund or need assistance, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>Call Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundStatusPage;
