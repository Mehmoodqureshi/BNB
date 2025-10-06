'use client';

import React from 'react';
import { CheckCircle, Download, Mail, Calendar, MapPin, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

interface PaymentSuccessProps {
  paymentIntentId: string;
  amount: number;
  currency: string;
  bookingId: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  onViewBooking?: () => void;
  onDownloadReceipt?: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  paymentIntentId,
  amount,
  currency,
  bookingId,
  propertyTitle,
  checkIn,
  checkOut,
  guests,
  onViewBooking,
  onDownloadReceipt
}) => {
  const router = useRouter();

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleContinue = () => {
    if (onViewBooking) {
      onViewBooking();
    } else {
      router.push('/bookings');
    }
  };

  const handleDownloadReceipt = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
    } else {
      // Simulate receipt download
      console.log('Downloading receipt...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/10 dark:to-purple-900/10 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <CheckCircle className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100">
            Your booking has been confirmed and payment processed
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="h-5 w-5 text-[#006699] mr-2" />
              Payment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                <span className="text-gray-900 dark:text-white font-mono text-sm">{paymentIntentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {formatAmount(amount, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Booking ID</span>
                <span className="text-gray-900 dark:text-white font-mono text-sm">{bookingId}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-[#006699] mr-2" />
              Booking Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{propertyTitle}</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Dubai, UAE</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(checkIn).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Guests</p>
                <p className="font-medium text-gray-900 dark:text-white">{guests} guest{guests > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              What's Next?
            </h3>
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p>You'll receive a booking confirmation email shortly with all the details.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Check-in Instructions</p>
                  <p>The host will send you check-in instructions 24 hours before your arrival.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Download className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Receipt & Invoice</p>
                  <p>Download your receipt and invoice from your booking details.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="secondary"
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Receipt</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleContinue}
              className="flex items-center justify-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>View Booking</span>
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-[#006699] hover:text-[#005588] font-medium"
            >
              Continue Browsing Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
