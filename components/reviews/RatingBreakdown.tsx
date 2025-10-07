'use client';

import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { ReviewStats } from '@/lib/types/reviews';
import { calculateRatingPercentage, getRatingLabel } from '@/lib/services/reviewService';

interface RatingBreakdownProps {
  stats: ReviewStats;
  showCategoryRatings?: boolean;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ 
  stats,
  showCategoryRatings = true 
}) => {
  const { averageRating, totalReviews, ratingDistribution, categoryAverages, recommendationRate } = stats;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Overall Rating */}
      <div className="flex items-start space-x-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getRatingLabel(averageRating)}
          </p>
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
          
          {/* Rating Distribution Bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution] || 0;
              const percentage = calculateRatingPercentage(count, totalReviews);
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#006699] to-[#0088cc] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Ratings */}
      {showCategoryRatings && Object.keys(categoryAverages).some(key => categoryAverages[key as keyof typeof categoryAverages]) && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            Rating Categories
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(categoryAverages).map(([key, value]) => (
              value && value > 0 ? (
                <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {value.toFixed(1)}
                    </span>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}

      {/* Recommendation Rate */}
      {recommendationRate > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {recommendationRate}% of guests recommend this property
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Based on {totalReviews} verified review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingBreakdown;

