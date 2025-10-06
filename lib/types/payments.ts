export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    funding: 'credit' | 'debit' | 'prepaid';
  };
  bank_account?: {
    bank_name: string;
    last4: string;
    account_type: 'checking' | 'savings';
  };
  is_default: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  type: 'payment' | 'refund' | 'chargeback' | 'commission';
  description: string;
  payment_method_id: string;
  booking_id?: string;
  property_id?: string;
  host_id?: string;
  guest_id: string;
  fees: {
    service_fee: number;
    processing_fee: number;
    platform_commission: number;
  };
  created_at: string;
  updated_at: string;
  receipt_url?: string;
  failure_reason?: string;
  metadata?: Record<string, any>;
}

export interface Refund {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  reason: 'requested_by_customer' | 'duplicate' | 'fraudulent' | 'other';
  description?: string;
  created_at: string;
  processed_at?: string;
  receipt_url?: string;
  failure_reason?: string;
}

export interface BillingAddress {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  client_secret: string;
  payment_method_id?: string;
  booking_id: string;
  created_at: string;
}

export interface Commission {
  id: string;
  booking_id: string;
  host_id: string;
  guest_id: string;
  amount: number;
  currency: string;
  percentage: number;
  status: 'pending' | 'paid' | 'disputed';
  payout_date?: string;
  created_at: string;
}

export interface Payout {
  id: string;
  host_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  scheduled_date: string;
  paid_date?: string;
  transactions: string[];
  created_at: string;
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  savePaymentMethod: boolean;
}

export interface CheckoutSession {
  id: string;
  booking_id: string;
  amount_total: number;
  currency: string;
  status: 'open' | 'complete' | 'expired';
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  url?: string;
  created_at: string;
}
