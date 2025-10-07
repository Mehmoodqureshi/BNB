'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, MessageCircle, Calendar, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Review } from '@/lib/types/reviews';
import { formatReviewDate } from '@/lib/services/reviewService';
import Button from '../ui/Button';

interface ReviewCardProps {
  review: Review;
  onMarkHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onRespond?: (reviewId: string, response: string) => void;
  showRespondButton?: boolean;
  isHelpful?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onMarkHelpful,
  onReport,
  onRespond,
  showRespondButton = false,
  isHelpful = false,
}) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLongComment = review.comment.length > 300;
  const displayComment = showFullComment || !isLongComment 
    ? review.comment 
    : review.comment.substring(0, 300) + '...';

  const handleRespond = async () => {
    if (!responseText.trim() || !onRespond) return;
    
    setIsSubmitting(true);
    try {
      await onRespond(review.id, responseText);
      setShowResponseForm(false);
      setResponseText('');
    } catch (error) {
      console.error('Failed to submit response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      {/* Reviewer Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <img
            src={review.reviewer.profilePicture || '/default-avatar.png'}
            alt={review.reviewer.firstName}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.reviewer.firstName} {review.reviewer.lastName}
              </h4>
              {review.isVerified && (
                <div className="flex items-center space-x-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Verified</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>{formatReviewDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Overall Rating */}
        <div className="flex items-center space-x-1 bg-[#006699] px-3 py-1.5 rounded-lg">
          <Star className="h-4 w-4 text-white fill-white" />
          <span className="text-white font-bold">{review.overallRating.toFixed(1)}</span>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {review.title}
        </h5>
      )}

      {/* Comment */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">
        {displayComment}
      </p>
      
      {isLongComment && (
        <button
          onClick={() => setShowFullComment(!showFullComment)}
          className="text-sm text-[#006699] hover:text-[#005588] font-medium mb-4 flex items-center space-x-1"
        >
          <span>{showFullComment ? 'Show less' : 'Show more'}</span>
          {showFullComment ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}

      {/* Category Ratings */}
      {Object.keys(review.categoryRatings).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {Object.entries(review.categoryRatings).map(([key, value]) => (
            value && (
              <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {key}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{value}</span>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {review.photos.slice(0, 3).map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Review photo ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(photo, '_blank')}
            />
          ))}
          {review.photos.length > 3 && (
            <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                +{review.photos.length - 3} more
              </span>
            </div>
          )}
        </div>
      )}

      {/* Host Response */}
      {review.response && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-[#006699] rounded-r-lg p-4">
          <div className="flex items-start space-x-3">
            <MessageCircle className="h-5 w-5 text-[#006699] mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Response from {review.response.responder.firstName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatReviewDate(review.response.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {review.response.comment}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Response Form */}
      {showResponseForm && !review.response && (
        <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none mb-3"
          />
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleRespond}
              disabled={!responseText.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowResponseForm(false);
                setResponseText('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onMarkHelpful?.(review.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
              isHelpful
                ? 'bg-[#006699] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm font-medium">{review.helpfulCount}</span>
          </button>
          
          {showRespondButton && !review.response && (
            <button
              onClick={() => setShowResponseForm(!showResponseForm)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Respond</span>
            </button>
          )}
        </div>
        
        <button
          onClick={() => onReport?.(review.id)}
          className="flex items-center space-x-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Flag className="h-4 w-4" />
          <span className="text-sm">Report</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;

