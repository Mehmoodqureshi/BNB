'use client';

import React, { useState } from 'react';
import { CreditCard, Lock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { PaymentMethod } from '@/lib/types/payments';
import Button from '../ui/Button';

interface StripeCheckoutProps {
  amount: number;
  currency: string;
  description: string;
  paymentMethods: PaymentMethod[];
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  amount,
  currency,
  description,
  paymentMethods,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
  isLoading = false
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods.find(pm => pm.is_default)?.id || paymentMethods[0]?.id || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');

  const selectedMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success (90% success rate for demo)
      if (Math.random() > 0.1) {
        onPaymentSuccess('pi_' + Date.now());
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getCardDisplayInfo = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.card) {
      const { brand, last4, exp_month, exp_year } = paymentMethod.card;
      return {
        title: `${brand.toUpperCase()} •••• ${last4}`,
        subtitle: `Expires ${exp_month.toString().padStart(2, '0')}/${exp_year}`
      };
    }
    return {
      title: 'Digital Wallet',
      subtitle: 'Apple Pay / Google Pay'
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006699] to-[#005588] p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Complete Payment</h2>
            <p className="text-white/80 text-sm">Secure checkout powered by Stripe</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Payment Summary */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{description}</span>
              <span className="text-gray-900 dark:text-white">{formatAmount(amount, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Service fee</span>
              <span className="text-gray-900 dark:text-white">{formatAmount(amount * 0.03, currency)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">{formatAmount(amount * 1.03, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((paymentMethod) => {
              const cardInfo = getCardDisplayInfo(paymentMethod);
              const isSelected = selectedPaymentMethod === paymentMethod.id;
              
              return (
                <div
                  key={paymentMethod.id}
                  onClick={() => setSelectedPaymentMethod(paymentMethod.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isSelected
                        ? 'border-[#006699] bg-[#006699]'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cardInfo.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cardInfo.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Secure Payment
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your payment is processed securely by Stripe. We never store your payment details.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                  Payment Error
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{paymentError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePayment}
            disabled={isProcessing || !selectedPaymentMethod}
            className="flex items-center space-x-2 min-w-[140px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Pay {formatAmount(amount * 1.03, currency)}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
