'use client';

import React from 'react';
import { CreditCard, Trash2, Star, Building, Wallet } from 'lucide-react';
import { PaymentMethod } from '@/lib/types/payments';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  isDefault?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onSetDefault,
  onDelete,
  isDefault = false
}) => {
  const getCardIcon = () => {
    if (paymentMethod.type === 'digital_wallet') {
      return <Wallet className="h-6 w-6 text-blue-600" />;
    }
    if (paymentMethod.type === 'bank_account') {
      return <Building className="h-6 w-6 text-green-600" />;
    }
    return <CreditCard className="h-6 w-6 text-gray-600" />;
  };

  const getCardInfo = () => {
    if (paymentMethod.card) {
      const { brand, last4, exp_month, exp_year } = paymentMethod.card;
      return {
        title: `${brand.toUpperCase()} •••• ${last4}`,
        subtitle: `Expires ${exp_month.toString().padStart(2, '0')}/${exp_year}`,
        type: 'Card'
      };
    }
    if (paymentMethod.bank_account) {
      const { bank_name, last4, account_type } = paymentMethod.bank_account;
      return {
        title: `${bank_name} •••• ${last4}`,
        subtitle: `${account_type.charAt(0).toUpperCase() + account_type.slice(1)} Account`,
        type: 'Bank Account'
      };
    }
    return {
      title: 'Digital Wallet',
      subtitle: 'Apple Pay / Google Pay',
      type: 'Digital Wallet'
    };
  };

  const cardInfo = getCardInfo();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-6 transition-all duration-200 ${
      isDefault 
        ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10' 
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getCardIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {cardInfo.title}
              </h3>
              {isDefault && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-[#006699] text-white text-xs rounded-full">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Default</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cardInfo.subtitle}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {cardInfo.type}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isDefault && (
            <button
              onClick={() => onSetDefault(paymentMethod.id)}
              className="px-3 py-1 text-xs font-medium text-[#006699] hover:text-[#005588] hover:bg-[#006699]/10 rounded-lg transition-colors"
            >
              Set Default
            </button>
          )}
          <button
            onClick={() => onDelete(paymentMethod.id)}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete payment method"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
