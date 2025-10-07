/**
 * Review System Types
 */

export interface Review {
  id: string;
  bookingId: string;
  propertyId: string;
  reviewerId: string;
  reviewerType: 'guest' | 'host';
  revieweeId: string; // The person being reviewed
  overallRating: number; // 1-5
  categoryRatings: CategoryRatings;
  title?: string;
  comment: string;
  photos?: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  response?: ReviewResponse;
  helpfulCount: number;
  reportCount: number;
  isPublic: boolean;
  status: 'pending' | 'published' | 'hidden' | 'flagged';
  
  // Reviewer info
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    reviewCount: number;
    averageRating: number;
  };
}

export interface CategoryRatings {
  cleanliness?: number; // 1-5
  communication?: number; // 1-5
  checkIn?: number; // 1-5
  accuracy?: number; // 1-5 (how accurate was the listing)
  location?: number; // 1-5
  value?: number; // 1-5 (value for money)
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  responderId: string;
  comment: string;
  createdAt: string;
  responder: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface CreateReviewRequest {
  bookingId: string;
  propertyId: string;
  revieweeId: string;
  overallRating: number;
  categoryRatings: CategoryRatings;
  title?: string;
  comment: string;
  photos?: File[];
  isPublic?: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryAverages: CategoryRatings;
  verifiedReviewCount: number;
  recommendationRate: number; // Percentage of 4-5 star reviews
}

export interface ReviewFilter {
  rating?: number; // Filter by star rating
  verified?: boolean; // Only verified reviews
  hasPhotos?: boolean; // Only reviews with photos
  hasResponse?: boolean; // Only reviews with host response
  sortBy?: 'recent' | 'highest' | 'lowest' | 'helpful';
  searchQuery?: string;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: string;
  daysRemaining?: number;
  deadline?: Date;
}

export interface ReviewReminder {
  id: string;
  bookingId: string;
  userId: string;
  propertyId: string;
  checkOutDate: string;
  reminderDate: string;
  status: 'pending' | 'sent' | 'completed' | 'expired';
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  reporterId: string;
  reason: 'inappropriate' | 'spam' | 'fake' | 'offensive' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  createdAt: string;
  resolvedAt?: string;
}

export interface ReviewHelpful {
  reviewId: string;
  userId: string;
  isHelpful: boolean;
  createdAt: string;
}

