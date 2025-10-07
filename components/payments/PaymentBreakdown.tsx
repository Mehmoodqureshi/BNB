'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, DollarSign, Shield, Receipt } from 'lucide-react';
import { PriceBreakdown, formatCurrency, CancellationPolicy, calculateRefundAmount } from '@/lib/services/paymentCalculations';

interface PaymentBreakdownProps {
  breakdown: PriceBreakdown;
  currency?: string;
  showHostView?: boolean;
  cancellationPolicy?: CancellationPolicy;
  checkInDate?: Date;
  onDownloadInvoice?: () => void;
}

const PaymentBreakdownComponent: React.FC<PaymentBreakdownProps> = ({
  breakdown,
  currency = 'AED',
  showHostView = false,
  cancellationPolicy,
  checkInDate,
  onDownloadInvoice,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [showRefundInfo, setShowRefundInfo] = useState(false);

  // Calculate refund amounts if policy and date provided
  const refundCalculation = cancellationPolicy && checkInDate ? 
    calculateRefundAmount(breakdown.guestTotal, checkInDate, cancellationPolicy) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Payment Breakdown</h3>
              <p className="text-blue-100 text-sm">
                {showHostView ? 'Your earnings breakdown' : 'Complete price details'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Base Price Section */}
        {showDetails && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Base Charges
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(breakdown.basePrice, currency)} × {breakdown.nights} night{breakdown.nights > 1 ? 's' : ''}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(breakdown.subtotal, currency)}
                </span>
              </div>

              {breakdown.cleaningFee > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">Cleaning fee</span>
                    <div className="group relative">
                      <Info className="h-3 w-3 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg z-10">
                        One-time fee charged by the host to cover cleaning costs
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(breakdown.cleaningFee, currency)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guest View: Fees Section */}
        {!showHostView && showDetails && (
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Fees & Taxes
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg z-10">
                      This fee helps us run our platform and provide 24/7 customer support
                    </div>
                  </div>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(breakdown.serviceFee, currency)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">VAT (5%)</span>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg z-10">
                      UAE Value Added Tax as required by law
                    </div>
                  </div>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(breakdown.vatAmount, currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Host View: Deductions Section */}
        {showHostView && showDetails && (
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Deductions
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Platform commission</span>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg z-10">
                      12% commission for using our platform and services
                    </div>
                  </div>
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  -{formatCurrency(breakdown.platformCommission, currency)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Processing fee</span>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg z-10">
                      Payment processing fees (Stripe: 2.9% + AED 1)
                    </div>
                  </div>
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  -{formatCurrency(breakdown.processingFee, currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Total Section */}
        <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {showHostView ? 'Your Earnings' : 'Total'}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {showHostView ? 'After all deductions' : 'Including all fees and taxes'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-[#006699] dark:text-[#00aaff]">
                {formatCurrency(showHostView ? breakdown.hostEarnings : breakdown.guestTotal, currency)}
              </span>
              {showHostView && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Held until check-in
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cancellation Policy Info */}
        {cancellationPolicy && checkInDate && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowRefundInfo(!showRefundInfo)}
              className="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Cancellation Policy: {cancellationPolicy.charAt(0).toUpperCase() + cancellationPolicy.slice(1)}
                </span>
              </div>
              {showRefundInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showRefundInfo && refundCalculation && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Potential Refund Amounts:
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">If cancelled today:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(refundCalculation.refundAmount, currency)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({refundCalculation.refundPercentage}%)
                        </span>
                      </span>
                    </div>
                    {refundCalculation.penaltyAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Cancellation penalty:</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          -{formatCurrency(refundCalculation.penaltyAmount, currency)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                  {refundCalculation.reason}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Badge */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Secure Payment Guarantee
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your payment is protected with industry-standard encryption. 
                {showHostView 
                  ? ' Funds are held securely until guest check-in.'
                  : ' Pay with confidence - your booking is secured.'}
              </p>
            </div>
          </div>
        </div>

        {/* Download Invoice Button */}
        {onDownloadInvoice && (
          <button
            onClick={onDownloadInvoice}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Receipt className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Download Invoice
            </span>
          </button>
        )}
      </div>

      {/* Summary Comparison (for host view) */}
      {showHostView && showDetails && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Guest Pays</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(breakdown.guestTotal, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">You Receive</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(breakdown.hostEarnings, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Platform Takes</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {formatCurrency(breakdown.platformCommission + breakdown.processingFee, currency)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentBreakdownComponent;

