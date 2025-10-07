'use client';

import React, { useState } from 'react';
import { X, Star, Upload, Loader2, CheckCircle } from 'lucide-react';
import { CategoryRatings } from '@/lib/types/reviews';
import { validateReview, calculateOverallFromCategories } from '@/lib/services/reviewService';
import Button from '../ui/Button';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  propertyTitle: string;
  hostName: string;
  onSubmit: (reviewData: ReviewFormData) => Promise<void>;
}

export interface ReviewFormData {
  overallRating: number;
  categoryRatings: CategoryRatings;
  title: string;
  comment: string;
  photos: File[];
  isPublic: boolean;
}

const categories = [
  { key: 'cleanliness', label: 'Cleanliness', description: 'How clean was the property?' },
  { key: 'communication', label: 'Communication', description: 'How well did the host communicate?' },
  { key: 'checkIn', label: 'Check-in', description: 'How smooth was the check-in process?' },
  { key: 'accuracy', label: 'Accuracy', description: 'How accurate was the listing?' },
  { key: 'location', label: 'Location', description: 'How was the location?' },
  { key: 'value', label: 'Value', description: 'Was it good value for money?' },
];

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  propertyTitle,
  hostName,
  onSubmit,
}) => {
  const [step, setStep] = useState<'ratings' | 'written' | 'photos' | 'preview'>('ratings');
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<CategoryRatings>({});
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCategoryRating = (category: keyof CategoryRatings, rating: number) => {
    setCategoryRatings(prev => ({ ...prev, [category]: rating }));
    
    // Auto-calculate overall rating
    const newRatings = { ...categoryRatings, [category]: rating };
    const calculatedOverall = calculateOverallFromCategories(newRatings);
    if (calculatedOverall > 0) {
      setOverallRating(calculatedOverall);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > 5 * 1024 * 1024) return false; // 5MB max
      return true;
    });
    
    setPhotos(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const validation = validateReview(overallRating, categoryRatings, comment);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors([]);
    
    try {
      await onSubmit({
        overallRating,
        categoryRatings,
        title,
        comment,
        photos,
        isPublic,
      });
      
      // Reset form
      setStep('ratings');
      setOverallRating(0);
      setCategoryRatings({});
      setTitle('');
      setComment('');
      setPhotos([]);
      onClose();
    } catch (error) {
      setErrors(['Failed to submit review. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isStepComplete = () => {
    switch (step) {
      case 'ratings':
        return overallRating > 0 && Object.keys(categoryRatings).length >= 3;
      case 'written':
        return comment.trim().length >= 10;
      case 'photos':
        return true; // Photos are optional
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Leave a Review</h2>
                <p className="text-blue-100 text-sm">{propertyTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-6 flex items-center space-x-2">
            {['Ratings', 'Written Review', 'Photos', 'Preview'].map((stepName, index) => {
              const stepKeys: typeof step[] = ['ratings', 'written', 'photos', 'preview'];
              const currentStepIndex = stepKeys.indexOf(step);
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <React.Fragment key={stepName}>
                  <div className={`flex-1 h-2 rounded-full transition-all ${
                    isCompleted ? 'bg-white' :
                    isActive ? 'bg-white/60' :
                    'bg-white/20'
                  }`} />
                  {index < 3 && <div className="w-2" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Ratings */}
          {step === 'ratings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How was your stay?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your overall rating for {propertyTitle}
                </p>
                
                {/* Overall Rating */}
                <div className="flex items-center justify-center space-x-2 mb-8">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setOverallRating(rating)}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-12 w-12 transition-colors ${
                          rating <= (hoveredRating || overallRating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                
                {overallRating > 0 && (
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                    You rated: <span className="font-semibold text-[#006699]">{overallRating} stars</span>
                  </p>
                )}
              </div>

              {/* Category Ratings */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                  Rate specific aspects
                </h4>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{category.label}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{category.description}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleCategoryRating(category.key as keyof CategoryRatings, rating)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-6 w-6 transition-colors ${
                                  rating <= (categoryRatings[category.key as keyof CategoryRatings] || 0)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Written Review */}
          {step === 'written' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tell us more about your experience
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Review Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Amazing stay in Dubai!"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details about your experience at this property..."
                    rows={6}
                    maxLength={2000}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Minimum 10 characters
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.length}/2000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 'photos' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Add photos (Optional)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Help others by adding photos of your experience (Max 5 photos, 5MB each)
                </p>
                
                <label className="block w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#006699] hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Click to upload photos
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                
                {photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Review Preview
                </h3>
                
                {/* Overall Rating */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-6 w-6 ${
                            rating <= overallRating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overallRating}.0
                    </span>
                  </div>
                </div>
                
                {/* Title */}
                {title && (
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h4>
                )}
                
                {/* Comment */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                  {comment}
                </p>
                
                {/* Photos Preview */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                
                {/* Category Ratings */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">Category Ratings</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(categoryRatings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Privacy Setting */}
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-[#006699] rounded"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                    Make this review public (visible to other users)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => {
                if (step === 'ratings') {
                  onClose();
                } else {
                  const steps: typeof step[] = ['ratings', 'written', 'photos', 'preview'];
                  const currentIndex = steps.indexOf(step);
                  setStep(steps[currentIndex - 1]);
                }
              }}
              disabled={isSubmitting}
            >
              {step === 'ratings' ? 'Cancel' : 'Back'}
            </Button>
            
            <Button
              variant="primary"
              onClick={() => {
                if (step === 'preview') {
                  handleSubmit();
                } else {
                  const steps: typeof step[] = ['ratings', 'written', 'photos', 'preview'];
                  const currentIndex = steps.indexOf(step);
                  setStep(steps[currentIndex + 1]);
                }
              }}
              disabled={!isStepComplete() || isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : step === 'preview' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit Review</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewModal;

