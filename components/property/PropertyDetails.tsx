'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Star, MapPin, Wifi, Car, Coffee, Waves, Shield, Clock, Users, Calendar, Share2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../providers/ThemeProvider';
import { FilterProvider } from '../providers/FilterProvider';
import Button from '@/components/ui/Button';
import ReservationPage from './ReservationPage';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isSuperhost?: boolean;
  type: string;
  beds: number;
  baths: number;
  guests: number;
  slug: string;
  description: string;
  amenities: string[];
  host: {
    name: string;
    avatar: string;
    joinedDate: string;
    responseRate: string;
    responseTime: string;
  };
  houseRules: string[];
  cancellationPolicy: string;
}

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const { isDark } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleReserve = () => {
    setShowReservation(true);
  };

  const handleBackToProperty = () => {
    setShowReservation(false);
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi className="h-5 w-5 text-[#006699]" />,
    'Kitchen': <Coffee className="h-5 w-5 text-[#006699]" />,
    'Washer': <Waves className="h-5 w-5 text-[#006699]" />,
    'Dryer': <Waves className="h-5 w-5 text-[#006699]" />,
    'Air conditioning': <Shield className="h-5 w-5 text-[#006699]" />,
    'Heating': <Shield className="h-5 w-5 text-[#006699]" />,
    'TV': <Shield className="h-5 w-5 text-[#006699]" />,
    'Hair dryer': <Shield className="h-5 w-5 text-[#006699]" />,
    'Iron': <Shield className="h-5 w-5 text-[#006699]" />,
    'Laptop friendly workspace': <Shield className="h-5 w-5 text-[#006699]" />,
    'Beach access': <Waves className="h-5 w-5 text-[#006699]" />,
    'Pool': <Waves className="h-5 w-5 text-[#006699]" />,
    'Hot tub': <Waves className="h-5 w-5 text-[#006699]" />,
  };

  const displayedAmenities = showAllAmenities ? property.amenities : property.amenities.slice(0, 8);

  if (showReservation) {
    return (
      <FilterProvider>
        <ReservationPage property={property} onBack={handleBackToProperty} />
      </FilterProvider>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Image Gallery */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-[35vh] sm:h-[40vh] lg:h-[50vh]">
          {/* Main Image */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-lg group">
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Navigation Arrows for Main Image */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? property.images.length - 1 : currentImageIndex - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex === property.images.length - 1 ? 0 : currentImageIndex + 1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
          
          {/* Side Images */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-2">
            {property.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg group">
                <Image
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  fill
                  className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setCurrentImageIndex(index + 1)}
                />
                {/* Overlay to show which image is currently selected */}
                <div className={clsx(
                  'absolute inset-0 border-2 rounded-lg transition-all duration-200',
                  currentImageIndex === index + 1 ? 'border-[#006699]' : 'border-transparent'
                )} />
              </div>
            ))}
          </div>
        </div>


        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={clsx(
            'absolute top-6 right-6 p-3 rounded-full transition-all duration-200 shadow-lg',
            isFavorited 
              ? 'bg-[#006699] text-white' 
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
          )}
        >
          <Heart 
            className={clsx(
              'h-5 w-5',
              isFavorited && 'fill-current'
            )} 
          />
        </button>

        {/* Share Button */}
        <button className="absolute top-6 right-20 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Property Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-[#006699] fill-current" />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {property.rating}
                  </span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    ({property.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-1" />
                {property.location}
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {property.guests} guests · {property.beds} beds · {property.baths} baths
                </span>
                {property.isSuperhost && (
                  <span className="bg-[#006699] text-white px-3 py-1 rounded-full text-xs font-medium">
                    Superhost
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                About this place
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      {amenityIcons[amenity] || <Shield className="h-5 w-5 text-[#006699]" />}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
              {property.amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4 text-sm font-medium underline text-gray-900 dark:text-white"
                >
                  {showAllAmenities ? 'Show less' : `Show all ${property.amenities.length} amenities`}
                </button>
              )}
            </div>

            {/* House Rules */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                House rules
              </h2>
              <ul className="space-y-2">
                {property.houseRules.map((rule, index) => (
                  <li key={index} className="text-sm flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 bg-[#006699] rounded-full mr-3 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Cancellation policy
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {property.cancellationPolicy}
              </p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-6 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    AED {property.price}
                  </span>
                  <span className="text-sm ml-1 text-gray-600 dark:text-gray-400">
                    night
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-[#006699] fill-current mr-1" />
                  <span className="text-gray-900 dark:text-white">
                    {property.rating}
                  </span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    ({property.reviewCount})
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                      CHECK-IN
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Add date
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                      CHECKOUT
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Add date
                    </div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                  <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                    GUESTS
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {property.guests} guests
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  isDark={isDark}
                  className="w-full"
                  onClick={handleReserve}
                >
                  Reserve
                </Button>

                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

