/**
 * Payment Calculations Service
 * Handles all payment-related calculations including commissions, fees, VAT, and breakdowns
 */

export interface PriceBreakdown {
  basePrice: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  vatAmount: number;
  totalAmount: number;
  guestTotal: number;
  hostEarnings: number;
  platformCommission: number;
  processingFee: number;
}

export interface CommissionStructure {
  platformCommissionRate: number; // 0.12 = 12%
  serviceFeeRate: number; // 0.03 = 3%
  processingFeeRate: number; // 0.029 = 2.9%
  processingFeeFixed: number; // 100 = AED 1.00
  vatRate: number; // 0.05 = 5% (UAE VAT)
}

// Default commission structure
const DEFAULT_COMMISSION: CommissionStructure = {
  platformCommissionRate: 0.12, // 12% platform commission
  serviceFeeRate: 0.03, // 3% service fee (paid by guest)
  processingFeeRate: 0.029, // 2.9% Stripe fee
  processingFeeFixed: 100, // AED 1.00 in cents
  vatRate: 0.05, // 5% VAT (UAE)
};

/**
 * Calculate complete price breakdown for a booking
 */
export function calculatePriceBreakdown(
  pricePerNight: number,
  nights: number,
  cleaningFee: number = 0,
  commissionStructure: CommissionStructure = DEFAULT_COMMISSION
): PriceBreakdown {
  // Base calculations
  const basePrice = pricePerNight * 100; // Convert to cents
  const subtotal = basePrice * nights;
  const cleaningFeeInCents = cleaningFee * 100;
  
  // Guest-facing fees
  const serviceFee = Math.round(subtotal * commissionStructure.serviceFeeRate);
  const amountBeforeVAT = subtotal + cleaningFeeInCents + serviceFee;
  const vatAmount = Math.round(amountBeforeVAT * commissionStructure.vatRate);
  const guestTotal = amountBeforeVAT + vatAmount;
  
  // Platform fees
  const platformCommission = Math.round(subtotal * commissionStructure.platformCommissionRate);
  const processingFee = Math.round(
    (subtotal * commissionStructure.processingFeeRate) + commissionStructure.processingFeeFixed
  );
  
  // Host earnings (what host receives after all fees)
  const hostEarnings = subtotal + cleaningFeeInCents - platformCommission - processingFee;
  
  return {
    basePrice: Math.round(basePrice),
    nights,
    subtotal,
    cleaningFee: cleaningFeeInCents,
    serviceFee,
    vatAmount,
    totalAmount: subtotal + cleaningFeeInCents,
    guestTotal,
    hostEarnings,
    platformCommission,
    processingFee,
  };
}

/**
 * Calculate commission for a specific amount
 */
export function calculateCommission(
  amount: number,
  commissionRate: number = DEFAULT_COMMISSION.platformCommissionRate
): number {
  return Math.round(amount * commissionRate);
}

/**
 * Calculate VAT (5% in UAE)
 */
export function calculateVAT(
  amount: number,
  vatRate: number = DEFAULT_COMMISSION.vatRate
): number {
  return Math.round(amount * vatRate);
}

/**
 * Calculate service fee (charged to guest)
 */
export function calculateServiceFee(
  amount: number,
  serviceFeeRate: number = DEFAULT_COMMISSION.serviceFeeRate
): number {
  return Math.round(amount * serviceFeeRate);
}

/**
 * Calculate Stripe processing fee
 */
export function calculateProcessingFee(
  amount: number,
  commissionStructure: CommissionStructure = DEFAULT_COMMISSION
): number {
  return Math.round(
    (amount * commissionStructure.processingFeeRate) + 
    commissionStructure.processingFeeFixed
  );
}

/**
 * Calculate host payout amount (what host receives)
 */
export function calculateHostPayout(
  subtotal: number,
  cleaningFee: number = 0,
  commissionStructure: CommissionStructure = DEFAULT_COMMISSION
): number {
  const platformCommission = calculateCommission(subtotal, commissionStructure.platformCommissionRate);
  const processingFee = calculateProcessingFee(subtotal, commissionStructure);
  
  return subtotal + cleaningFee - platformCommission - processingFee;
}

/**
 * Format amount from cents to currency string
 */
export function formatCurrency(
  amountInCents: number,
  currency: string = 'AED'
): string {
  const amount = amountInCents / 100;
  return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Calculate refund amount based on cancellation policy
 */
export interface RefundCalculation {
  refundAmount: number;
  refundPercentage: number;
  penaltyAmount: number;
  isEligible: boolean;
  reason: string;
}

export type CancellationPolicy = 'flexible' | 'moderate' | 'strict' | 'non_refundable';

export function calculateRefundAmount(
  totalPaid: number,
  checkInDate: Date,
  cancellationPolicy: CancellationPolicy,
  cancellationDate: Date = new Date()
): RefundCalculation {
  const daysUntilCheckIn = Math.ceil(
    (checkInDate.getTime() - cancellationDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let refundPercentage = 0;
  let reason = '';
  
  switch (cancellationPolicy) {
    case 'flexible':
      if (daysUntilCheckIn >= 1) {
        refundPercentage = 100;
        reason = 'Full refund: Cancelled 24+ hours before check-in';
      } else {
        refundPercentage = 0;
        reason = 'No refund: Cancelled within 24 hours of check-in';
      }
      break;
      
    case 'moderate':
      if (daysUntilCheckIn >= 5) {
        refundPercentage = 100;
        reason = 'Full refund: Cancelled 5+ days before check-in';
      } else if (daysUntilCheckIn >= 1) {
        refundPercentage = 50;
        reason = '50% refund: Cancelled 1-4 days before check-in';
      } else {
        refundPercentage = 0;
        reason = 'No refund: Cancelled within 24 hours of check-in';
      }
      break;
      
    case 'strict':
      if (daysUntilCheckIn >= 14) {
        refundPercentage = 100;
        reason = 'Full refund: Cancelled 14+ days before check-in';
      } else if (daysUntilCheckIn >= 7) {
        refundPercentage = 50;
        reason = '50% refund: Cancelled 7-13 days before check-in';
      } else {
        refundPercentage = 0;
        reason = 'No refund: Cancelled within 7 days of check-in';
      }
      break;
      
    case 'non_refundable':
      refundPercentage = 0;
      reason = 'Non-refundable booking';
      break;
      
    default:
      refundPercentage = 0;
      reason = 'Unknown policy';
  }
  
  const refundAmount = Math.round(totalPaid * (refundPercentage / 100));
  const penaltyAmount = totalPaid - refundAmount;
  
  return {
    refundAmount,
    refundPercentage,
    penaltyAmount,
    isEligible: refundAmount > 0,
    reason,
  };
}

/**
 * Calculate host payout schedule
 */
export interface PayoutSchedule {
  bookingId: string;
  checkInDate: Date;
  amount: number;
  releaseDate: Date;
  status: 'held' | 'pending_release' | 'released' | 'cancelled';
  daysUntilRelease: number;
}

export function calculatePayoutSchedule(
  bookingId: string,
  checkInDate: Date,
  amount: number,
  bookingStatus: 'confirmed' | 'cancelled' | 'completed' = 'confirmed'
): PayoutSchedule {
  const now = new Date();
  const releaseDate = new Date(checkInDate);
  releaseDate.setHours(15, 0, 0, 0); // Release at 3 PM on check-in day
  
  const daysUntilRelease = Math.ceil(
    (releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let status: PayoutSchedule['status'];
  
  if (bookingStatus === 'cancelled') {
    status = 'cancelled';
  } else if (now >= releaseDate) {
    status = 'released';
  } else if (daysUntilRelease <= 1) {
    status = 'pending_release';
  } else {
    status = 'held';
  }
  
  return {
    bookingId,
    checkInDate,
    amount,
    releaseDate,
    status,
    daysUntilRelease,
  };
}

/**
 * Aggregate host earnings for a period
 */
export interface HostEarnings {
  totalEarnings: number;
  totalBookings: number;
  platformCommission: number;
  processingFees: number;
  netEarnings: number;
  pendingPayouts: number;
  releasedPayouts: number;
  averageBookingValue: number;
}

export function aggregateHostEarnings(
  payoutSchedules: PayoutSchedule[]
): HostEarnings {
  const released = payoutSchedules.filter(p => p.status === 'released');
  const pending = payoutSchedules.filter(p => p.status === 'held' || p.status === 'pending_release');
  
  const totalEarnings = payoutSchedules.reduce((sum, p) => sum + p.amount, 0);
  const releasedPayouts = released.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = pending.reduce((sum, p) => sum + p.amount, 0);
  
  // Calculate totals from breakdown (reverse engineer)
  const estimatedPlatformCommission = Math.round(totalEarnings * 0.12);
  const estimatedProcessingFees = Math.round(totalEarnings * 0.029 + (100 * payoutSchedules.length));
  
  return {
    totalEarnings,
    totalBookings: payoutSchedules.length,
    platformCommission: estimatedPlatformCommission,
    processingFees: estimatedProcessingFees,
    netEarnings: totalEarnings,
    pendingPayouts,
    releasedPayouts,
    averageBookingValue: payoutSchedules.length > 0 ? totalEarnings / payoutSchedules.length : 0,
  };
}

