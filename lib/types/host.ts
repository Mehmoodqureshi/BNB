export interface Host {
  id: string;
  userId: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'not_started';
  verificationDocuments: HostDocument[];
  superhostStatus: 'none' | 'pending' | 'verified' | 'suspended';
  responseRate: number;
  responseTime: string;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  joinedDate: string;
  profile: {
    bio: string;
    languages: string[];
    work: string;
    education: string;
    interests: string[];
    profilePicture?: string;
  };
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
    iban?: string;
    swiftCode?: string;
  };
  taxInformation?: {
    taxId: string;
    businessName?: string;
    businessType?: string;
    taxExempt: boolean;
  };
}

export interface HostDocument {
  id: string;
  type: 'government_id' | 'business_license' | 'tax_certificate' | 'insurance' | 'other';
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface PropertyListing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'villa' | 'condo' | 'studio' | 'penthouse' | 'townhouse';
  propertyType: 'entire_place' | 'private_room' | 'shared_room';
  location: {
    address: string;
    city?: string;
    emirate: string;
    country: string;
    postalCode?: string;
    lat: number;
    lng: number;
    neighborhood?: string;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
  };
  amenities: PropertyAmenity[];
  houseRules: string[];
  pricing: {
    basePrice: number;
    currency: 'AED' | 'USD' | 'EUR';
    cleaningFee?: number;
    serviceFee?: number;
    securityDeposit?: number;
    extraGuestFee?: number;
    weekendPrice?: number;
    monthlyDiscount?: number;
    weeklyDiscount?: number;
  };
  availability: {
    minimumStay: number;
    maximumStay?: number;
    advanceBookingLimit: number;
    checkInTime: string;
    checkOutTime: string;
    instantBook: boolean;
  };
  photos: PropertyPhoto[];
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rejectionReason?: string;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  category: 'basic' | 'safety' | 'family' | 'outdoor' | 'kitchen' | 'bathroom' | 'bedroom' | 'entertainment' | 'location' | 'parking';
  icon: string;
  isIncluded: boolean;
}

export interface PropertyPhoto {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  uploadedAt: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface HostBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'completed';
  totalAmount: number;
  hostEarnings: number;
  platformFee: number;
  cleaningFee: number;
  serviceFee: number;
  createdAt: string;
  updatedAt: string;
  specialRequests?: string;
  cancellationPolicy: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partial_refund';
}

export interface HostAnalytics {
  period: 'week' | 'month' | 'quarter' | 'year';
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    occupancyRate: number;
  };
  revenue: {
    totalEarnings: number;
    averageBookingValue: number;
    monthlyGrowth: number;
    platformFees: number;
    netEarnings: number;
  };
  guests: {
    totalGuests: number;
    repeatGuests: number;
    averageRating: number;
    totalReviews: number;
  };
  properties: {
    totalProperties: number;
    activeProperties: number;
    averageOccupancy: number;
    topPerformingProperty?: string;
  };
}

export interface CalendarEvent {
  id: string;
  propertyId: string;
  date: string;
  type: 'available' | 'blocked' | 'booked' | 'maintenance' | 'pricing_rule';
  price?: number;
  minimumStay?: number;
  maximumStay?: number;
  instantBook?: boolean;
  notes?: string;
  bookingId?: string;
  guestName?: string;
}

export interface PricingRule {
  id: string;
  propertyId: string;
  name: string;
  type: 'seasonal' | 'weekend' | 'event' | 'last_minute' | 'early_bird' | 'length_of_stay';
  startDate: string;
  endDate: string;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  priceModifier: number; // Percentage or fixed amount
  minimumStay?: number;
  maximumStay?: number;
  isActive: boolean;
  createdAt: string;
}

export interface HostMessage {
  id: string;
  conversationId: string;
  propertyId?: string;
  bookingId?: string;
  senderId: string;
  senderType: 'host' | 'guest';
  recipientId: string;
  content: string;
  attachments?: MessageAttachment[];
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface HostReview {
  id: string;
  propertyId: string;
  bookingId: string;
  guestId: string;
  guestName: string;
  guestAvatar?: string;
  rating: number;
  comment: string;
  response?: string;
  responseDate?: string;
  categories: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
  createdAt: string;
  isPublic: boolean;
  helpful: number;
  notHelpful: number;
}

export interface HostNotification {
  id: string;
  hostId: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'message_received' | 'review_received' | 'payment_received' | 'calendar_update' | 'verification_update';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface HostEarnings {
  id: string;
  hostId: string;
  propertyId: string;
  bookingId: string;
  period: string; // YYYY-MM
  grossEarnings: number;
  platformFee: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  netEarnings: number;
  currency: string;
  payoutDate: string;
  payoutStatus: 'pending' | 'processing' | 'completed' | 'failed';
  payoutMethod: string;
}

export interface HostVerificationStep {
  id: string;
  title: string;
  description: string;
  type: 'document_upload' | 'phone_verification' | 'email_verification' | 'identity_verification' | 'bank_verification';
  isCompleted: boolean;
  isRequired: boolean;
  completedAt?: string;
  documents?: HostDocument[];
}

export interface HostPerformance {
  propertyId: string;
  propertyTitle: string;
  metrics: {
    occupancyRate: number;
    averageRating: number;
    totalBookings: number;
    revenue: number;
    cancellationRate: number;
    responseRate: number;
    responseTime: string;
  };
  period: string;
  comparison: {
    previousPeriod: {
      occupancyRate: number;
      revenue: number;
      bookings: number;
    };
    growth: {
      occupancyRate: number;
      revenue: number;
      bookings: number;
    };
  };
}

export interface HostSettings {
  notifications: {
    email: {
      bookingRequests: boolean;
      bookingConfirmations: boolean;
      messages: boolean;
      reviews: boolean;
      payments: boolean;
      marketing: boolean;
    };
    sms: {
      urgentBookings: boolean;
      messages: boolean;
      payments: boolean;
    };
    push: {
      all: boolean;
      bookings: boolean;
      messages: boolean;
      reviews: boolean;
    };
  };
  privacy: {
    showEarnings: boolean;
    showOccupancy: boolean;
    allowDirectBooking: boolean;
    requireApproval: boolean;
  };
  business: {
    autoAcceptBookings: boolean;
    minimumNotice: number; // hours
    maximumAdvanceBooking: number; // days
    defaultCancellationPolicy: string;
    currency: string;
    timezone: string;
  };
}
