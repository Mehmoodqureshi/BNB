'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { Transaction } from '@/lib/types/payments';
import Button from '../ui/Button';

interface RefundRequestModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (refundData: RefundRequestData) => Promise<void>;
}

interface RefundRequestData {
  amount: number;
  reason: string;
  description?: string;
  fullRefund: boolean;
}

const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [refundData, setRefundData] = useState<RefundRequestData>({
    amount: transaction.amount,
    reason: 'requested_by_customer',
    description: '',
    fullRefund: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'reason' | 'amount' | 'confirm'>('reason');

  const refundReasons = [
    {
      value: 'requested_by_customer',
      label: 'Customer Request',
      description: 'I want to cancel my booking'
    },
    {
      value: 'duplicate',
      label: 'Duplicate Payment',
      description: 'This payment was made twice'
    },
    {
      value: 'fraudulent',
      label: 'Fraudulent Charge',
      description: 'This payment was unauthorized'
    },
    {
      value: 'other',
      label: 'Other Reason',
      description: 'Please specify below'
    }
  ];

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const maxAmount = transaction.amount;
    const validAmount = Math.min(Math.max(numValue, 0), maxAmount);
    
    setRefundData(prev => ({
      ...prev,
      amount: validAmount,
      fullRefund: validAmount === maxAmount
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(refundData);
      onClose();
    } catch (error) {
      console.error('Refund request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Request Refund</h2>
                <p className="text-orange-100 text-sm">Transaction: {transaction.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Transaction Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Description</span>
                <span className="text-gray-900 dark:text-white">{transaction.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Original Amount</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {formatAmount(transaction.amount, transaction.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Reason Selection */}
          {step === 'reason' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Why are you requesting a refund?
                </h3>
                <div className="space-y-3">
                  {refundReasons.map((reason) => (
                    <div
                      key={reason.value}
                      onClick={() => setRefundData(prev => ({ ...prev, reason: reason.value }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        refundData.reason === reason.value
                          ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          refundData.reason === reason.value
                            ? 'border-[#006699] bg-[#006699]'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {refundData.reason === reason.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{reason.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{reason.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {refundData.reason === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Please provide more details
                  </label>
                  <textarea
                    value={refundData.description}
                    onChange={(e) => setRefundData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Please explain why you need a refund..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Amount Selection */}
          {step === 'amount' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Refund Amount
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="fullRefund"
                      checked={refundData.fullRefund}
                      onChange={(e) => {
                        const isFullRefund = e.target.checked;
                        setRefundData(prev => ({
                          ...prev,
                          fullRefund: isFullRefund,
                          amount: isFullRefund ? transaction.amount : prev.amount
                        }));
                      }}
                      className="h-4 w-4 text-[#006699] focus:ring-[#006699] border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="fullRefund" className="text-gray-700 dark:text-gray-300">
                      Full refund ({formatAmount(transaction.amount, transaction.currency)})
                    </label>
                  </div>

                  {!refundData.fullRefund && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Partial refund amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          value={refundData.amount / 100}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          max={transaction.amount / 100}
                          min={0}
                          step="0.01"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Maximum refund: {formatAmount(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Refund Policy Notice */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Refund Policy
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Refunds are processed within 5-10 business days. The refund will be credited to your original payment method.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Review Your Refund Request
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please review the details before submitting your refund request.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Refund Reason</span>
                    <span className="text-gray-900 dark:text-white">
                      {refundReasons.find(r => r.value === refundData.reason)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Refund Amount</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatAmount(refundData.amount, transaction.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
                    <span className="text-gray-900 dark:text-white">5-10 business days</span>
                  </div>
                </div>
              </div>

              {refundData.description && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Notes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{refundData.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              {step !== 'reason' && (
                <Button
                  variant="secondary"
                  onClick={() => setStep(step === 'amount' ? 'reason' : 'amount')}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              {step === 'reason' && (
                <Button
                  variant="primary"
                  onClick={() => setStep('amount')}
                  disabled={!refundData.reason}
                >
                  Continue
                </Button>
              )}
              {step === 'amount' && (
                <Button
                  variant="primary"
                  onClick={() => setStep('confirm')}
                  disabled={refundData.amount <= 0}
                >
                  Continue
                </Button>
              )}
              {step === 'confirm' && (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundRequestModal;
