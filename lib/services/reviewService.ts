/**
 * Review Service
 * Handles review calculations, validation, and utilities
 */

import { Review, ReviewStats, CategoryRatings, ReviewEligibility } from '@/lib/types/reviews';

/**
 * Calculate average rating from reviews
 */
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.overallRating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate rating distribution
 */
export function calculateRatingDistribution(reviews: Review[]): ReviewStats['ratingDistribution'] {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    const rating = Math.floor(review.overallRating) as 1 | 2 | 3 | 4 | 5;
    distribution[rating]++;
  });
  
  return distribution;
}

/**
 * Calculate category averages
 */
export function calculateCategoryAverages(reviews: Review[]): CategoryRatings {
  if (reviews.length === 0) {
    return {
      cleanliness: 0,
      communication: 0,
      checkIn: 0,
      accuracy: 0,
      location: 0,
      value: 0,
    };
  }
  
  const totals: CategoryRatings = {
    cleanliness: 0,
    communication: 0,
    checkIn: 0,
    accuracy: 0,
    location: 0,
    value: 0,
  };
  
  const counts: CategoryRatings = {
    cleanliness: 0,
    communication: 0,
    checkIn: 0,
    accuracy: 0,
    location: 0,
    value: 0,
  };
  
  reviews.forEach(review => {
    Object.keys(review.categoryRatings).forEach(key => {
      const categoryKey = key as keyof CategoryRatings;
      const value = review.categoryRatings[categoryKey];
      if (value) {
        totals[categoryKey] = (totals[categoryKey] || 0) + value;
        counts[categoryKey] = (counts[categoryKey] || 0) + 1;
      }
    });
  });
  
  const averages: CategoryRatings = {};
  Object.keys(totals).forEach(key => {
    const categoryKey = key as keyof CategoryRatings;
    const total = totals[categoryKey] || 0;
    const count = counts[categoryKey] || 0;
    averages[categoryKey] = count > 0 ? Math.round((total / count) * 10) / 10 : 0;
  });
  
  return averages;
}

/**
 * Calculate complete review stats
 */
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  const publishedReviews = reviews.filter(r => r.status === 'published');
  const verifiedReviews = publishedReviews.filter(r => r.isVerified);
  
  const averageRating = calculateAverageRating(publishedReviews);
  const ratingDistribution = calculateRatingDistribution(publishedReviews);
  const categoryAverages = calculateCategoryAverages(publishedReviews);
  
  // Calculate recommendation rate (4-5 stars)
  const recommendedCount = publishedReviews.filter(r => r.overallRating >= 4).length;
  const recommendationRate = publishedReviews.length > 0 
    ? Math.round((recommendedCount / publishedReviews.length) * 100) 
    : 0;
  
  return {
    totalReviews: publishedReviews.length,
    averageRating,
    ratingDistribution,
    categoryAverages,
    verifiedReviewCount: verifiedReviews.length,
    recommendationRate,
  };
}

/**
 * Check if user can leave a review
 */
export function checkReviewEligibility(
  booking: {
    id: string;
    checkOutDate: string;
    status: string;
  },
  existingReview?: Review
): ReviewEligibility {
  // Already reviewed
  if (existingReview) {
    return {
      canReview: false,
      reason: 'You have already reviewed this booking',
    };
  }
  
  // Booking must be completed
  if (booking.status !== 'completed') {
    return {
      canReview: false,
      reason: 'You can only review completed stays',
    };
  }
  
  const checkOutDate = new Date(booking.checkOutDate);
  const now = new Date();
  const daysSinceCheckout = Math.floor(
    (now.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Must wait until checkout
  if (daysSinceCheckout < 0) {
    return {
      canReview: false,
      reason: 'You can leave a review after your checkout date',
    };
  }
  
  // Review window: 14 days after checkout
  const reviewDeadline = new Date(checkOutDate);
  reviewDeadline.setDate(reviewDeadline.getDate() + 14);
  
  if (now > reviewDeadline) {
    return {
      canReview: false,
      reason: 'Review period has expired (14 days after checkout)',
    };
  }
  
  const daysRemaining = Math.ceil(
    (reviewDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return {
    canReview: true,
    daysRemaining,
    deadline: reviewDeadline,
  };
}

/**
 * Validate review data
 */
export function validateReview(
  overallRating: number,
  categoryRatings: CategoryRatings,
  comment: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check overall rating
  if (overallRating < 1 || overallRating > 5) {
    errors.push('Overall rating must be between 1 and 5');
  }
  
  // Check category ratings
  Object.entries(categoryRatings).forEach(([key, value]) => {
    if (value && (value < 1 || value > 5)) {
      errors.push(`${key} rating must be between 1 and 5`);
    }
  });
  
  // Check comment
  if (!comment || comment.trim().length < 10) {
    errors.push('Review comment must be at least 10 characters');
  }
  
  if (comment.length > 2000) {
    errors.push('Review comment must not exceed 2000 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sort reviews
 */
export function sortReviews(
  reviews: Review[],
  sortBy: 'recent' | 'highest' | 'lowest' | 'helpful'
): Review[] {
  const sorted = [...reviews];
  
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'highest':
      return sorted.sort((a, b) => b.overallRating - a.overallRating);
    case 'lowest':
      return sorted.sort((a, b) => a.overallRating - b.overallRating);
    case 'helpful':
      return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
    default:
      return sorted;
  }
}

/**
 * Filter reviews
 */
export function filterReviews(
  reviews: Review[],
  filters: {
    rating?: number;
    verified?: boolean;
    hasPhotos?: boolean;
    hasResponse?: boolean;
    searchQuery?: string;
  }
): Review[] {
  let filtered = [...reviews];
  
  // Filter by rating
  if (filters.rating) {
    filtered = filtered.filter(r => Math.floor(r.overallRating) === filters.rating);
  }
  
  // Filter by verified
  if (filters.verified !== undefined) {
    filtered = filtered.filter(r => r.isVerified === filters.verified);
  }
  
  // Filter by photos
  if (filters.hasPhotos) {
    filtered = filtered.filter(r => r.photos && r.photos.length > 0);
  }
  
  // Filter by response
  if (filters.hasResponse !== undefined) {
    filtered = filtered.filter(r => filters.hasResponse ? !!r.response : !r.response);
  }
  
  // Search in comments
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(r => 
      r.comment.toLowerCase().includes(query) ||
      r.title?.toLowerCase().includes(query) ||
      r.reviewer.firstName.toLowerCase().includes(query) ||
      r.reviewer.lastName.toLowerCase().includes(query)
    );
  }
  
  return filtered;
}

/**
 * Calculate rating percentage for distribution
 */
export function calculateRatingPercentage(
  count: number,
  total: number
): number {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

/**
 * Get rating label
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.8) return 'Exceptional';
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Average';
  if (rating >= 2.0) return 'Below Average';
  return 'Poor';
}

/**
 * Get category rating color
 */
export function getCategoryRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
  if (rating >= 4.0) return 'text-blue-600 dark:text-blue-400';
  if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
  if (rating >= 3.0) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Format review date
 */
export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

/**
 * Calculate overall rating from category ratings
 */
export function calculateOverallFromCategories(categoryRatings: CategoryRatings): number {
  const ratings = Object.values(categoryRatings).filter(r => r !== undefined) as number[];
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

/**
 * Get review summary text
 */
export function getReviewSummary(stats: ReviewStats): string {
  const { averageRating, totalReviews, recommendationRate } = stats;
  
  if (totalReviews === 0) {
    return 'No reviews yet';
  }
  
  const label = getRatingLabel(averageRating);
  return `${label} · ${averageRating} (${totalReviews} review${totalReviews > 1 ? 's' : ''}) · ${recommendationRate}% recommend`;
}

