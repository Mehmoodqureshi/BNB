'use client';

import React, { useState } from 'react';
import { Search, Filter, Star, Shield, Image as ImageIcon, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { Review } from '@/lib/types/reviews';
import { sortReviews, filterReviews } from '@/lib/services/reviewService';
import ReviewCard from './ReviewCard';

interface ReviewsListProps {
  reviews: Review[];
  onMarkHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onRespond?: (reviewId: string, response: string) => void;
  showRespondButton?: boolean;
  helpfulReviews?: string[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onMarkHelpful,
  onReport,
  onRespond,
  showRespondButton = false,
  helpfulReviews = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showWithPhotosOnly, setShowWithPhotosOnly] = useState(false);
  const [showWithResponseOnly, setShowWithResponseOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting
  let displayedReviews = filterReviews(reviews, {
    rating: selectedRating || undefined,
    verified: showVerifiedOnly || undefined,
    hasPhotos: showWithPhotosOnly || undefined,
    hasResponse: showWithResponseOnly || undefined,
    searchQuery: searchQuery || undefined,
  });
  
  displayedReviews = sortReviews(displayedReviews, sortBy);

  const activeFiltersCount = [
    selectedRating,
    showVerifiedOnly,
    showWithPhotosOnly,
    showWithResponseOnly,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeFiltersCount > 0
                  ? 'bg-[#006699] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Rating Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedRating === rating
                          ? 'bg-[#006699] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Star className="h-3 w-3 inline mb-0.5" /> {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                  className="h-4 w-4 text-[#006699] rounded"
                />
                <label htmlFor="verifiedOnly" className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Verified only</span>
                </label>
              </div>

              {/* Photos Only */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="photosOnly"
                  checked={showWithPhotosOnly}
                  onChange={(e) => setShowWithPhotosOnly(e.target.checked)}
                  className="h-4 w-4 text-[#006699] rounded"
                />
                <label htmlFor="photosOnly" className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                  <ImageIcon className="h-4 w-4 text-purple-600" />
                  <span>With photos</span>
                </label>
              </div>

              {/* Response Only */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="responseOnly"
                  checked={showWithResponseOnly}
                  onChange={(e) => setShowWithResponseOnly(e.target.checked)}
                  className="h-4 w-4 text-[#006699] rounded"
                />
                <label htmlFor="responseOnly" className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span>With response</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedRating(null);
                    setShowVerifiedOnly(false);
                    setShowWithPhotosOnly(false);
                    setShowWithResponseOnly(false);
                    setSearchQuery('');
                  }}
                  className="text-sm text-[#006699] hover:text-[#005588] font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {displayedReviews.length} of {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 mt-6">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {reviews.length === 0 
                ? 'No reviews yet. Be the first to leave a review!' 
                : 'No reviews match your filters. Try adjusting your search.'}
            </p>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onMarkHelpful={onMarkHelpful}
              onReport={onReport}
              onRespond={onRespond}
              showRespondButton={showRespondButton}
              isHelpful={helpfulReviews.includes(review.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;

