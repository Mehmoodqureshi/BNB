'use client';

import React, { useState } from 'react';
import { X, DollarSign, Calendar, AlertTriangle, CheckCircle, Calculator, Info } from 'lucide-react';
import { calculateRefundAmount, CancellationPolicy, formatCurrency } from '@/lib/services/paymentCalculations';
import Button from '../ui/Button';

interface RefundCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RefundCalculatorModal: React.FC<RefundCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [totalPaid, setTotalPaid] = useState('1565.03');
  const [checkInDate, setCheckInDate] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy>('moderate');
  const [refundResult, setRefundResult] = useState<ReturnType<typeof calculateRefundAmount> | null>(null);

  const handleCalculate = () => {
    if (!checkInDate || !totalPaid) {
      alert('Please fill in all fields');
      return;
    }

    const totalInCents = Math.round(parseFloat(totalPaid) * 100);
    const result = calculateRefundAmount(
      totalInCents,
      new Date(checkInDate),
      cancellationPolicy
    );
    
    setRefundResult(result);
  };

  const policyDescriptions: Record<CancellationPolicy, string> = {
    flexible: 'Cancel ≥24 hours before check-in: 100% refund. Cancel within 24 hours: No refund.',
    moderate: 'Cancel ≥5 days before: 100% refund. Cancel 1-4 days before: 50% refund. Cancel within 24 hours: No refund.',
    strict: 'Cancel ≥14 days before: 100% refund. Cancel 7-13 days before: 50% refund. Cancel <7 days: No refund.',
    non_refundable: 'No refunds under any circumstances.'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Refund Calculator</h2>
                <p className="text-blue-100 text-sm">Calculate your potential refund amount</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Amount Paid (AED)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={totalPaid}
                  onChange={(e) => setTotalPaid(e.target.value)}
                  placeholder="1565.03"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the total amount you paid for the booking
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Check-in Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When is your scheduled check-in?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cancellation Policy
              </label>
              <select
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value as CancellationPolicy)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="flexible">Flexible (24 hours)</option>
                <option value="moderate">Moderate (5 days)</option>
                <option value="strict">Strict (14 days)</option>
                <option value="non_refundable">Non-refundable</option>
              </select>
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {policyDescriptions[cancellationPolicy]}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              variant="primary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Calculator className="h-5 w-5" />
              <span>Calculate Refund</span>
            </Button>
          </div>

          {/* Results Section */}
          {refundResult && (
            <div className="space-y-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg ${
                refundResult.isEligible 
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center space-x-3">
                  {refundResult.isEligible ? (
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${
                      refundResult.isEligible 
                        ? 'text-green-900 dark:text-green-100' 
                        : 'text-red-900 dark:text-red-100'
                    }`}>
                      {refundResult.isEligible ? 'Refund Eligible' : 'Not Eligible for Refund'}
                    </h3>
                    <p className={`text-sm ${
                      refundResult.isEligible 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {refundResult.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Breakdown */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Refund Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Original Payment</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(parseFloat(totalPaid) * 100, 'AED')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Refund Percentage</span>
                    <span className={`text-lg font-semibold ${
                      refundResult.refundPercentage > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {refundResult.refundPercentage}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Refund Amount</span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(refundResult.refundAmount, 'AED')}
                    </span>
                  </div>
                  
                  {refundResult.penaltyAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cancellation Penalty</span>
                      <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                        -{formatCurrency(refundResult.penaltyAmount, 'AED')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span>You Keep</span>
                  <span>{refundResult.refundPercentage}%</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${refundResult.refundPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <span>Penalty: {100 - refundResult.refundPercentage}%</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Total: {formatCurrency(parseFloat(totalPaid) * 100, 'AED')}
                  </span>
                </div>
              </div>

              {/* Time Until Check-in */}
              {checkInDate && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Days Until Check-in
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.ceil((new Date(checkInDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        If you cancel today: {formatCurrency(refundResult.refundAmount, 'AED')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Information Notice */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                      Important Information
                    </p>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Refunds are processed within 5-10 business days</li>
                      <li>• Refund will be credited to your original payment method</li>
                      <li>• Service fees may not be refundable</li>
                      <li>• Refund amount depends on when you cancel</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {refundResult.isEligible && (
                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={() => {
                      // In real app, would navigate to refund request page
                      alert('Refund request would be initiated. This will be connected to your backend.');
                      onClose();
                    }}
                    className="flex-1"
                  >
                    Request Refund
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Initial State - Policy Comparison */}
          {!refundResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cancellation Policy Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['flexible', 'moderate', 'strict', 'non_refundable'] as CancellationPolicy[]).map((policy) => (
                  <div 
                    key={policy}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      cancellationPolicy === policy
                        ? 'border-[#006699] bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                      {policy.replace('_', ' ')}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {policyDescriptions[policy]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundCalculatorModal;

