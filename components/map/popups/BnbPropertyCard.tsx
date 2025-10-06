'use client';

import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Bed, Bath, Users } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  beds: number;
  baths: number;
  guests: number;
  agency_id?: string;
  rent?: number;
  lat?: number;
  lng?: number;
}

interface BnbPropertyCardProps {
  property: Property;
  onClose: () => void;
  onSelect: () => void;
}

const BnbPropertyCard: React.FC<BnbPropertyCardProps> = ({ property, onClose, onSelect }) => {
  const price = property.rent || property.price;
  const currency = property.currency || 'AED';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="relative h-48 rounded-lg overflow-hidden mb-3">
          <Image
            src={property.images[0] || '/placeholder-property.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {property.title}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-[#006699] fill-current" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {property.rating}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{property.location}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.beds}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.baths}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{property.guests}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {currency} {price}
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/night</span>
            </div>
            <button
              onClick={onSelect}
              className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#004466] transition-colors text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BnbPropertyCard;
