'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../providers/ThemeProvider';

interface Property {
  id: string;
  title: string;
  location: string;
  emirate: string;
  area: string;
  price: number;
  currency: 'AED';
  rating: number;
  reviewCount: number;
  images: string[];
  isSuperhost?: boolean;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  slug: string;
  amenities: string[];
  viewType?: string;
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
}

interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onFavorite, 
  isFavorited = false 
}) => {
  const { isDark } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageChange = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <Link 
      href={`/property/${property.slug}`}
      className="group cursor-pointer block w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] xl:w-[calc(25%-0.75rem)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Image Navigation Arrows */}
          {property.images.length > 1 && isHovered && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageChange('prev');
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageChange('next');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Dots */}
          {property.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={clsx(
                    'w-1.5 h-1.5 rounded-full transition-colors',
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  )}
                />
              ))}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.(property.id);
            }}
            className={clsx(
              'absolute top-3 right-3 p-2 rounded-full transition-all duration-200',
              isFavorited 
                ? 'bg-[#006699] text-white' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
            )}
          >
            <Heart 
              className={clsx(
                'w-4 h-4',
                isFavorited && 'fill-current'
              )} 
            />
          </button>

          {/* Superhost Badge */}
          {property.isSuperhost && (
            <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-white">
              Superhost
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="mt-3 space-y-1">
          {/* Location and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3 mr-1" />
              {property.location}
            </div>
            <div className="flex items-center text-sm">
              <Star className="w-3 h-3 text-[#006699] fill-current mr-1" />
              <span className="font-medium text-gray-900 dark:text-white">
                {property.rating}
              </span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">
                ({property.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium line-clamp-2 group-hover:underline text-gray-900 dark:text-white">
            {property.title}
          </h3>

          {/* Property Type and Details */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {property.type} · {property.beds} beds · {property.baths} baths · Up to {property.guests} guests
          </div>

          {/* Price */}
          <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              AED {property.price}
            </span>
            <span className="text-sm ml-1 text-gray-600 dark:text-gray-400">
              night
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
