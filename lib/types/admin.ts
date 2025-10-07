/**
 * Admin Panel Types
 */

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support';
  permissions: AdminPermission[];
  createdAt: string;
  lastLogin?: string;
}

export type AdminPermission =
  | 'view_users'
  | 'edit_users'
  | 'delete_users'
  | 'approve_properties'
  | 'edit_properties'
  | 'delete_properties'
  | 'view_bookings'
  | 'cancel_bookings'
  | 'view_payments'
  | 'process_refunds'
  | 'moderate_reviews'
  | 'view_analytics'
  | 'manage_settings'
  | 'handle_disputes';

export interface PlatformStats {
  overview: {
    totalUsers: number;
    totalHosts: number;
    totalGuests: number;
    activeUsers: number; // Last 30 days
    newUsersToday: number;
    userGrowthRate: number; // Percentage
  };
  properties: {
    totalProperties: number;
    activeProperties: number;
    pendingApproval: number;
    inactiveProperties: number;
    averageRating: number;
    featuredProperties: number;
  };
  bookings: {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    bookingsToday: number;
    cancellationRate: number;
  };
  revenue: {
    totalRevenue: number;
    revenueToday: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    monthlyGrowth: number;
    platformCommission: number;
    averageBookingValue: number;
  };
  payments: {
    totalTransactions: number;
    successfulPayments: number;
    failedPayments: number;
    pendingRefunds: number;
    processedRefunds: number;
    chargebacks: number;
  };
  reviews: {
    totalReviews: number;
    averageRating: number;
    flaggedReviews: number;
    pendingModeration: number;
    reviewsToday: number;
  };
}

export interface UserManagementRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'guest' | 'host' | 'both';
  status: 'active' | 'suspended' | 'banned' | 'pending_verification';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  joinedDate: string;
  lastActive: string;
  totalBookings: number;
  totalSpent: number;
  totalEarnings?: number;
  averageRating: number;
  reviewCount: number;
  flags: UserFlag[];
}

export interface UserFlag {
  type: 'payment_issue' | 'suspicious_activity' | 'multiple_cancellations' | 'poor_reviews' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: string;
}

export interface PropertyManagementRecord {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'inactive';
  location: string;
  type: string;
  pricePerNight: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  lastModified: string;
  flags: PropertyFlag[];
  rejectionReason?: string;
}

export interface PropertyFlag {
  type: 'fake_listing' | 'poor_quality' | 'safety_concern' | 'pricing_issue' | 'misleading_photos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedBy?: string;
  createdAt: string;
}

export interface BookingManagementRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  guestId: string;
  guestName: string;
  hostId: string;
  hostName: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'disputed';
  totalAmount: number;
  platformCommission: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
  hasDispute: boolean;
  disputeReason?: string;
}

export interface PaymentManagementRecord {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'payout' | 'chargeback';
  status: 'pending' | 'succeeded' | 'failed' | 'disputed';
  paymentMethod: string;
  processingFee: number;
  platformCommission: number;
  createdAt: string;
  flags: PaymentFlag[];
}

export interface PaymentFlag {
  type: 'fraud_suspected' | 'high_value' | 'chargeback_risk' | 'unusual_pattern';
  riskScore: number;
  description: string;
}

export interface RefundRequest {
  id: string;
  transactionId: string;
  bookingId: string;
  requestedBy: string;
  requesterName: string;
  amount: number;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  adminNotes?: string;
}

export interface ReviewModeration {
  reviewId: string;
  propertyId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  flags: ReviewModerationFlag[];
  reports: ReviewReport[];
  createdAt: string;
}

export interface ReviewModerationFlag {
  type: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'irrelevant';
  confidence: number; // 0-100
  detectedBy: 'auto' | 'user_report' | 'admin';
}

export interface ReviewReport {
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  reportedAt: string;
}

export interface DisputeCase {
  id: string;
  type: 'booking_issue' | 'payment_dispute' | 'property_complaint' | 'refund_dispute' | 'review_dispute';
  status: 'open' | 'investigating' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  bookingId?: string;
  guestId: string;
  guestName: string;
  hostId: string;
  hostName: string;
  description: string;
  evidence: DisputeEvidence[];
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
  compensationAmount?: number;
}

export interface DisputeEvidence {
  type: 'photo' | 'document' | 'message' | 'receipt';
  url: string;
  uploadedBy: 'guest' | 'host' | 'admin';
  uploadedAt: string;
  description?: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  action: AdminActionType;
  targetType: 'user' | 'property' | 'booking' | 'review' | 'payment';
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export type AdminActionType =
  | 'approve_property'
  | 'reject_property'
  | 'suspend_user'
  | 'ban_user'
  | 'delete_review'
  | 'approve_refund'
  | 'reject_refund'
  | 'resolve_dispute'
  | 'edit_property'
  | 'cancel_booking';

export interface PlatformSettings {
  general: {
    platformName: string;
    platformEmail: string;
    platformPhone: string;
    supportEmail: string;
    timezone: string;
    currency: string;
  };
  commission: {
    platformCommissionRate: number;
    serviceFeeRate: number;
    processingFeeRate: number;
    vatRate: number;
  };
  bookings: {
    minimumBookingHours: number;
    maximumAdvanceBookingDays: number;
    defaultCancellationPolicy: string;
    instantBookingEnabled: boolean;
  };
  payments: {
    payoutSchedule: 'daily' | 'weekly' | 'monthly';
    escrowPeriodDays: number;
    minimumPayoutAmount: number;
    automaticRefundsEnabled: boolean;
  };
  reviews: {
    reviewWindowDays: number;
    minimumRatingForPublish: number;
    autoModeration: boolean;
    requireVerification: boolean;
  };
  notifications: {
    emailNotificationsEnabled: boolean;
    smsNotificationsEnabled: boolean;
    pushNotificationsEnabled: boolean;
  };
}

export interface AdminAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  isRead: boolean;
  createdAt: string;
}
