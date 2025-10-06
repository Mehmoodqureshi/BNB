'use client';

import React from 'react';
import { Star, MapPin } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  agency_id?: string;
  rent?: number;
}

interface BnbHoverCardProps {
  property: Property;
  onClose: () => void;
}

const BnbHoverCard: React.FC<BnbHoverCardProps> = ({ property, onClose }) => {
  const price = property.rent || property.price;
  const currency = property.currency || 'AED';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs border border-gray-200 dark:border-gray-700">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {property.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-[#006699] fill-current" />
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {property.rating}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ({property.reviewCount})
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {currency} {price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BnbHoverCard;
