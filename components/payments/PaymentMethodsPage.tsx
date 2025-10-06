'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, Plus, ChevronLeft, Settings, Star, 
  Shield, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { PaymentMethod } from '@/lib/types/payments';
import PaymentMethodCard from './PaymentMethodCard';
import PaymentMethodForm from './PaymentMethodForm';

const PaymentMethodsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/test-auth');
    return null;
  }

  // Mock payment methods data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
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

  const handleAddPaymentMethod = async (formData: any) => {
    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new payment method (in real app, this would come from API response)
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        card: {
          brand: 'visa',
          last4: formData.cardNumber.slice(-4),
          exp_month: parseInt(formData.expiryDate.split('/')[0]),
          exp_year: parseInt('20' + formData.expiryDate.split('/')[1]),
          funding: 'credit'
        },
        is_default: paymentMethods.length === 0,
        created_at: new Date().toISOString()
      };

      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add payment method:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(prev => 
        prev.map(pm => ({
          ...pm,
          is_default: pm.id === id
        }))
      );
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(prev => {
        const filtered = prev.filter(pm => pm.id !== id);
        // If we deleted the default, set the first remaining as default
        if (filtered.length > 0 && !filtered.some(pm => pm.is_default)) {
          filtered[0].is_default = true;
        }
        return filtered;
      });
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    }
  };

  const defaultPaymentMethod = paymentMethods.find(pm => pm.is_default);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-white/20 dark:border-gray-700/50">
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
                  <CreditCard className="h-6 w-6 text-[#006699] mr-2" />
                  Payment Methods
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your payment methods and billing</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Payment Method</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Default Payment Method */}
          {defaultPaymentMethod && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Default Payment Method</h2>
              </div>
              <PaymentMethodCard
                paymentMethod={defaultPaymentMethod}
                onSetDefault={handleSetDefault}
                onDelete={handleDelete}
                isDefault={true}
              />
            </div>
          )}

          {/* All Payment Methods */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Payment Methods ({paymentMethods.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secured by Stripe</span>
              </div>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Payment Methods
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add a payment method to make bookings easier and faster.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Payment Method</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((paymentMethod) => (
                  <PaymentMethodCard
                    key={paymentMethod.id}
                    paymentMethod={paymentMethod}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDelete}
                    isDefault={paymentMethod.is_default}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Security Information */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Your Payment Information is Secure
                </h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>All payment data is encrypted and processed by Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>We never store your full card details on our servers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>PCI DSS Level 1 compliant for maximum security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Information</h3>
              <button className="text-sm text-[#006699] hover:text-[#005588] font-medium">
                Edit Billing Address
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Billing address is used for tax calculation and receipt generation.</p>
              <p className="mt-1">Update your billing information in the payment method settings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddForm && (
        <PaymentMethodForm
          onSubmit={handleAddPaymentMethod}
          onCancel={() => setShowAddForm(false)}
          isLoading={isAdding}
          isModal={true}
        />
      )}
    </div>
  );
};

export default PaymentMethodsPage;
