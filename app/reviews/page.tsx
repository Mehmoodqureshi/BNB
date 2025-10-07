'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Star, Plus, ChevronLeft, Award } from 'lucide-react';
import { Review } from '@/lib/types/reviews';
import { calculateReviewStats } from '@/lib/services/reviewService';
import RatingBreakdown from '@/components/reviews/RatingBreakdown';
import ReviewsList from '@/components/reviews/ReviewsList';
import LeaveReviewModal from '@/components/reviews/LeaveReviewModal';
import Button from '@/components/ui/Button';

const ReviewsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showLeaveReview, setShowLeaveReview] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Mock review data
  const mockReviews: Review[] = [
    {
      id: 'rev_1',
      bookingId: 'bk_1',
      propertyId: 'prop_1',
      reviewerId: 'user_2',
      reviewerType: 'guest',
      revieweeId: 'host_1',
      overallRating: 4.8,
      categoryRatings: {
        cleanliness: 5,
        communication: 5,
        checkIn: 4,
        accuracy: 5,
        location: 5,
        value: 4,
      },
      title: 'Amazing stay in the heart of Dubai!',
      comment: 'This apartment exceeded all our expectations. The location is perfect, right next to Burj Khalifa and Dubai Mall. The host was incredibly responsive and helpful. The apartment was spotlessly clean and exactly as described in the photos. We especially loved the amazing city views from the balcony. Would definitely recommend and stay again!',
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      ],
      isVerified: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      response: {
        id: 'resp_1',
        reviewId: 'rev_1',
        responderId: 'host_1',
        comment: 'Thank you so much for your wonderful review! It was a pleasure hosting you and your family. We\'re thrilled you enjoyed the apartment and the location. You are welcome back anytime!',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        responder: {
          id: 'host_1',
          firstName: 'Ahmed',
          lastName: 'Al-Rashid',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        },
      },
      helpfulCount: 24,
      reportCount: 0,
      isPublic: true,
      status: 'published',
      reviewer: {
        id: 'user_2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
        reviewCount: 12,
        averageRating: 4.7,
      },
    },
    {
      id: 'rev_2',
      bookingId: 'bk_2',
      propertyId: 'prop_1',
      reviewerId: 'user_3',
      reviewerType: 'guest',
      revieweeId: 'host_1',
      overallRating: 5.0,
      categoryRatings: {
        cleanliness: 5,
        communication: 5,
        checkIn: 5,
        accuracy: 5,
        location: 5,
        value: 5,
      },
      title: 'Perfect in every way!',
      comment: 'Absolutely perfect stay! The apartment is modern, clean, and beautifully decorated. Check-in was seamless with clear instructions. The host went above and beyond to make sure we had everything we needed. Location couldn\'t be better. Highly recommend!',
      isVerified: true,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      helpfulCount: 18,
      reportCount: 0,
      isPublic: true,
      status: 'published',
      reviewer: {
        id: 'user_3',
        firstName: 'Mohammed',
        lastName: 'Al-Zahra',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        reviewCount: 8,
        averageRating: 4.9,
      },
    },
    {
      id: 'rev_3',
      bookingId: 'bk_3',
      propertyId: 'prop_1',
      reviewerId: 'user_4',
      reviewerType: 'guest',
      revieweeId: 'host_1',
      overallRating: 4.5,
      categoryRatings: {
        cleanliness: 5,
        communication: 4,
        checkIn: 4,
        accuracy: 5,
        location: 5,
        value: 4,
      },
      comment: 'Great apartment with stunning views. The location is unbeatable. Only minor issue was that check-in took a bit longer than expected, but everything else was excellent. The host was very friendly and helpful throughout our stay.',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      ],
      isVerified: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      helpfulCount: 12,
      reportCount: 0,
      isPublic: true,
      status: 'published',
      reviewer: {
        id: 'user_4',
        firstName: 'Emily',
        lastName: 'Chen',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        reviewCount: 5,
        averageRating: 4.6,
      },
    },
  ];

  const stats = calculateReviewStats(mockReviews);

  const handleMarkHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleReport = (reviewId: string) => {
    alert('Report functionality will be connected to backend. Review ID: ' + reviewId);
  };

  const handleRespond = async (reviewId: string, response: string) => {
    console.log('Responding to review:', reviewId, response);
    // In real app, would call API
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Response submitted! This will be connected to your backend.');
  };

  const handleSubmitReview = async (reviewData: any) => {
    console.log('Submitting review:', reviewData);
    // In real app, would call API
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Review submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-gray-200 dark:border-gray-700/50">
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
                  <Star className="h-6 w-6 text-[#006699] mr-2" />
                  Reviews & Ratings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Read guest experiences and leave your review</p>
              </div>
            </div>
            {isAuthenticated && (
              <Button
                variant="primary"
                onClick={() => setShowLeaveReview(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Leave a Review</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Rating Breakdown */}
          <div className="lg:col-span-1">
            <RatingBreakdown stats={stats} showCategoryRatings={true} />

            {/* Additional Stats */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Review Highlights
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified Reviews</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {stats.verifiedReviewCount}/{stats.totalReviews}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recommendation Rate</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {stats.recommendationRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                  <span className="text-sm font-bold text-[#006699]">
                    {stats.averageRating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Reviews List */}
          <div className="lg:col-span-2">
            <ReviewsList
              reviews={mockReviews}
              onMarkHelpful={handleMarkHelpful}
              onReport={handleReport}
              onRespond={handleRespond}
              showRespondButton={false}
              helpfulReviews={helpfulReviews}
            />
          </div>
        </div>
      </div>

      {/* Leave Review Modal */}
      <LeaveReviewModal
        isOpen={showLeaveReview}
        onClose={() => setShowLeaveReview(false)}
        bookingId="bk_demo"
        propertyTitle="Luxury Apartment in Downtown Dubai"
        hostName="Ahmed Al-Rashid"
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default ReviewsPage;

