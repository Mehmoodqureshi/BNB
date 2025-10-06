'use client';

import React from 'react';
import { 
  CreditCard, Download, Eye, ArrowUpRight, ArrowDownLeft, 
  Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Transaction } from '@/lib/types/payments';
import Button from '../ui/Button';

interface TransactionCardProps {
  transaction: Transaction;
  onViewDetails: (transactionId: string) => void;
  onDownloadReceipt: (transactionId: string) => void;
  onRequestRefund?: (transactionId: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onViewDetails,
  onDownloadReceipt,
  onRequestRefund
}) => {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'succeeded':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      case 'refunded':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'succeeded':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'canceled':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      case 'refunded':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'payment':
        return <ArrowDownLeft className="h-5 w-5 text-red-600" />;
      case 'refund':
        return <ArrowUpRight className="h-5 w-5 text-green-600" />;
      case 'commission':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'chargeback':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canRequestRefund = () => {
    return transaction.status === 'succeeded' && 
           transaction.type === 'payment' && 
           onRequestRefund &&
           new Date(transaction.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Within 30 days
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getTransactionIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {transaction.description}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(transaction.created_at)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${
            transaction.type === 'payment' || transaction.type === 'commission'
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            {transaction.type === 'payment' || transaction.type === 'commission' ? '-' : '+'}
            {formatAmount(transaction.amount, transaction.currency)}
          </div>
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="capitalize">{transaction.status}</span>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Transaction ID</p>
          <p className="text-sm font-mono text-gray-900 dark:text-white">{transaction.id}</p>
        </div>
        {transaction.booking_id && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Booking ID</p>
            <p className="text-sm font-mono text-gray-900 dark:text-white">{transaction.booking_id}</p>
          </div>
        )}
      </div>

      {/* Fees Breakdown */}
      {transaction.type === 'payment' && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Fee Breakdown</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
              <span className="text-gray-900 dark:text-white">
                {formatAmount(transaction.fees.service_fee, transaction.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
              <span className="text-gray-900 dark:text-white">
                {formatAmount(transaction.fees.processing_fee, transaction.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Platform Commission</span>
              <span className="text-gray-900 dark:text-white">
                {formatAmount(transaction.fees.platform_commission, transaction.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Failure Reason */}
      {transaction.failure_reason && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Failure Reason:</strong> {transaction.failure_reason}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(transaction.id)}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
          {transaction.receipt_url && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDownloadReceipt(transaction.id)}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Receipt</span>
            </Button>
          )}
        </div>
        
        {canRequestRefund() && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRequestRefund?.(transaction.id)}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            Request Refund
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
