'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Star, MapPin, Shield, CreditCard, CheckCircle } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useFilters } from '../providers/FilterProvider';
import Button from '../ui/Button';
import DateFilter from '../filters/DateFilter';
import GuestsFilter from '../filters/GuestsFilter';
import StripeCheckout from '../payments/StripeCheckout';
import PaymentSuccess from '../payments/PaymentSuccess';
import { PaymentMethod } from '@/lib/types/payments';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isSuperhost?: boolean;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  slug: string;
  description: string;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    joinedDate: string;
    responseRate: string;
    responseTime: string;
  };
  houseRules: string[];
  cancellationPolicy: string;
}

interface ReservationPageProps {
  property: Property;
  onBack: () => void;
}

const ReservationPage: React.FC<ReservationPageProps> = ({ property, onBack }) => {
  const { isDark } = useTheme();
  const { filters, updateFilters } = useFilters();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  
  // Mock payment methods - in real app, this would come from user's saved payment methods
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025,
        funding: 'credit'
      },
      is_default: true,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 'pm_2',
      type: 'card',
      card: {
        brand: 'mastercard',
        last4: '5555',
        exp_month: 8,
        exp_year: 2026,
        funding: 'debit'
      },
      is_default: false,
      created_at: '2024-01-10T14:20:00Z'
    }
  ]);

  // Initialize filters with property defaults
  useEffect(() => {
    if (!filters.checkIn && !filters.checkOut) {
      updateFilters({
        guests: { adults: 1, children: 0, infants: 0 }
      });
    }
  }, [filters.checkIn, filters.checkOut]);

  const calculateNights = () => {
    if (!filters.checkIn || !filters.checkOut) return 0;
    const start = new Date(filters.checkIn);
    const end = new Date(filters.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const basePrice = property.price * nights;
    const cleaningFee = 50;
    const serviceFee = Math.round(basePrice * 0.12);
    const taxes = Math.round(basePrice * 0.05);
    return {
      basePrice,
      cleaningFee,
      serviceFee,
      taxes,
      total: basePrice + cleaningFee + serviceFee + taxes
    };
  };

  const handleReserve = async () => {
    if (!filters.checkIn || !filters.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    // Show payment flow instead of direct booking
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentIntentId(paymentIntentId);
    setShowPayment(false);
    setIsSuccess(true);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // You could show an error message to the user here
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const pricing = calculateTotal();

  if (isSuccess) {
    return (
      <PaymentSuccess
        paymentIntentId={paymentIntentId}
        amount={pricing.total}
        currency="aed"
        bookingId={`bk_${Date.now()}`}
        propertyTitle={property.title}
        checkIn={filters.checkIn!}
        checkOut={filters.checkOut!}
        guests={filters.guests.adults + filters.guests.children + filters.guests.infants}
        onViewBooking={() => {
          // Navigate to bookings page
          window.location.href = '/bookings';
        }}
        onDownloadReceipt={() => {
          console.log('Download receipt for:', paymentIntentId);
        }}
      />
    );
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <StripeCheckout
            amount={pricing.total}
            currency="aed"
            description={`Booking for ${property.title}`}
            paymentMethods={paymentMethods}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={handlePaymentCancel}
            isLoading={isProcessing}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Complete your booking
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Summary */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex space-x-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {property.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-[#006699] fill-current mr-1" />
                    <span className="text-gray-900 dark:text-white">
                      {property.rating}
                    </span>
                    <span className="ml-1 text-gray-600 dark:text-gray-400">
                      ({property.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form - Hero Section Style */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your trip
              </h3>
              
              {/* Hero Section Style Filters */}
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Check In */}
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#006699] dark:text-[#00aaff] uppercase tracking-wide">Check in</label>
                    <DateFilter type="checkIn" />
                  </div>

                  {/* Check Out */}
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#006699] dark:text-[#00aaff] uppercase tracking-wide">Check out</label>
                    <DateFilter type="checkOut" />
                  </div>

                  {/* Guests */}
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#006699] dark:text-[#00aaff] uppercase tracking-wide">Guests</label>
                    <GuestsFilter />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    Payment method
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You'll be redirected to a secure payment page to complete your booking.
                </p>
              </div>
            </div>

            {/* House Rules */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                House rules
              </h3>
              <ul className="space-y-2">
                {property.houseRules.map((rule, index) => (
                  <li key={index} className="text-sm flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 bg-[#006699] rounded-full mr-3 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 p-6 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Booking summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    AED {property.price} × {calculateNights()} nights
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    AED {pricing.basePrice}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {filters.guests.adults + filters.guests.children + filters.guests.infants} guests
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    Included
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cleaning fee</span>
                  <span className="text-gray-900 dark:text-white">AED {pricing.cleaningFee}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                  <span className="text-gray-900 dark:text-white">AED {pricing.serviceFee}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                  <span className="text-gray-900 dark:text-white">AED {pricing.taxes}</span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">AED {pricing.total}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                isDark={isDark}
                className="w-full mt-6"
                onClick={handleReserve}
                disabled={isProcessing || !filters.checkIn || !filters.checkOut}
              >
                {isProcessing ? 'Processing...' : 'Reserve'}
              </Button>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
                You won't be charged until the host confirms your booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
