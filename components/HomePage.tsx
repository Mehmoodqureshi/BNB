'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Map, Star, Heart } from 'lucide-react';
import PropertyCard from './property/PropertyCard';
import Button from '@/components/ui/Button';
import { clsx } from 'clsx';
import { useTheme } from './providers/ThemeProvider';
import { useFilters } from './providers/FilterProvider';
import SearchModal from './filters/SearchModal';
import PropertyTypeFilter from './filters/PropertyTypeFilter';
import BedroomsFilter from './filters/BedroomsFilter';
import BathroomsFilter from './filters/BathroomsFilter';
import PriceRangeFilter from './filters/PriceRangeFilter';
import LocationFilter from './filters/LocationFilter';
import DateFilter from './filters/DateFilter';
import GuestsFilter from './filters/GuestsFilter';

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

const HomePage: React.FC = () => {
  const { isDark } = useTheme();
  const { filters, updateFilters } = useFilters();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // UAE Property data
  const properties: Property[] = [
    {
      id: '1',
      title: 'Luxury Apartment in Downtown Dubai',
      location: 'Downtown Dubai, Dubai',
      emirate: 'Dubai',
      area: 'Downtown Dubai',
      price: 450,
      currency: 'AED',
      rating: 4.8,
      reviewCount: 124,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
      ],
      isSuperhost: true,
      type: 'Apartment',
      beds: 2,
      baths: 2,
      guests: 4,
      slug: 'luxury-apartment-downtown-dubai',
      amenities: ['Wifi', 'Pool', 'Gym', 'Concierge', 'Parking'],
      viewType: 'City View',
      furnishing: 'Fully Furnished'
    },
    {
      id: '2',
      title: 'Beachfront Villa in Palm Jumeirah',
      location: 'Palm Jumeirah, Dubai',
      emirate: 'Dubai',
      area: 'Palm Jumeirah',
      price: 1200,
      currency: 'AED',
      rating: 4.9,
      reviewCount: 89,
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
      ],
      isSuperhost: false,
      type: 'Villa',
      beds: 4,
      baths: 3,
      guests: 8,
      slug: 'beachfront-villa-palm-jumeirah',
      amenities: ['Private Beach', 'Pool', 'BBQ Area', 'Garden', 'Maid\'s Room'],
      viewType: 'Sea View',
      furnishing: 'Fully Furnished'
    },
    {
      id: '3',
      title: 'Modern Penthouse in Marina',
      location: 'Dubai Marina, Dubai',
      emirate: 'Dubai',
      area: 'Dubai Marina',
      price: 800,
      currency: 'AED',
      rating: 4.7,
      reviewCount: 156,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-5e3e8e4c4c4c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
      ],
      isSuperhost: true,
      type: 'Penthouse',
      beds: 3,
      baths: 3,
      guests: 6,
      slug: 'modern-penthouse-dubai-marina',
      amenities: ['Marina View', 'Balcony', 'Gym', 'Pool', 'Valet Parking'],
      viewType: 'Marina View',
      furnishing: 'Fully Furnished'
    },
    {
      id: '4',
      title: 'Cozy Apartment in JBR',
      location: 'JBR, Dubai',
      emirate: 'Dubai',
      area: 'JBR',
      price: 350,
      currency: 'AED',
      rating: 4.6,
      reviewCount: 67,
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-14b1e0d0f905?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop'
      ],
      isSuperhost: false,
      type: 'Apartment',
      beds: 1,
      baths: 1,
      guests: 2,
      slug: 'cozy-apartment-jbr-dubai',
      amenities: ['Beach Access', 'Wifi', 'Air Conditioning', 'Kitchen'],
      viewType: 'Sea View',
      furnishing: 'Semi-Furnished'
    },
    {
      id: '5',
      title: 'Luxury Villa in Saadiyat Island',
      location: 'Saadiyat Island, Abu Dhabi',
      emirate: 'Abu Dhabi',
      area: 'Saadiyat Island',
      price: 1500,
      currency: 'AED',
      rating: 4.8,
      reviewCount: 203,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
      ],
      isSuperhost: true,
      type: 'Villa',
      beds: 5,
      baths: 4,
      guests: 10,
      slug: 'luxury-villa-saadiyat-island',
      amenities: ['Private Beach', 'Golf Course', 'Spa', 'Garden', 'Maid\'s Room', 'Study Room'],
      viewType: 'Golf Course View',
      furnishing: 'Fully Furnished'
    },
    {
      id: '6',
      title: 'Modern Apartment in Corniche',
      location: 'Corniche, Abu Dhabi',
      emirate: 'Abu Dhabi',
      area: 'Corniche',
      price: 400,
      currency: 'AED',
      rating: 4.9,
      reviewCount: 145,
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
      ],
      isSuperhost: true,
      type: 'Apartment',
      beds: 2,
      baths: 2,
      guests: 4,
      slug: 'modern-apartment-corniche-abu-dhabi',
      amenities: ['Corniche View', 'Gym', 'Pool', 'Parking', 'Concierge'],
      viewType: 'Corniche View',
      furnishing: 'Fully Furnished'
    }
  ];

  // Filter properties based on current filters
  const filteredProperties = properties.filter(property => {
    // Location filter
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase()) && 
        !property.emirate.toLowerCase().includes(filters.location.toLowerCase()) &&
        !property.area.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Property type filter
    if (filters.propertyType && property.type !== filters.propertyType) {
      return false;
    }

    // Price range filter
    if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms > 0 && property.beds < filters.bedrooms) {
      return false;
    }

    // Bathrooms filter
    if (filters.bathrooms > 0 && property.baths < filters.bathrooms) {
      return false;
    }

    return true;
  });

  const handleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-16">
      {/* Hero Section with Filters */}
      <section className="relative h-[70vh] max-h-[800px] overflow-visible">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop"
            alt="Beautiful destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#006699]/80 to-[#004466]/90 dark:from-gray-900/90 dark:to-gray-800/95" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          {/* Hero Text */}
          <div className="text-center max-w-4xl mb-12">
            <h1 className={clsx(
              'text-4xl md:text-6xl lg:text-7xl font-bold mb-6',
              'text-white drop-shadow-2xl'
            )}>
              Find your perfect
              <span className="block text-[#00aaff]">UAE home</span>
            </h1>
            <p className={clsx(
              'text-xl md:text-2xl lg:text-3xl mb-8',
              'text-white/95 drop-shadow-lg font-light'
            )}>
              Discover luxury properties across Dubai, Abu Dhabi, and all Emirates
            </p>
          </div>

          {/* Search Filters */}
          <div className="w-full max-w-5xl">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Location */}
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-sm font-bold text-[#006699] dark:text-[#00aaff] uppercase tracking-wide">Where</label>
                  <LocationFilter />
                </div>

                {/* Check In */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-[#006699] dark:text-[#00aaff] uppercase tracking-wide">Check in</label>
                  <DateFilter type="checkIn" />
                </div>

                {/* Check Out */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-[#006699] dark:text-[#00aaff] uppercase tracking-wide">Check out</label>
                  <DateFilter type="checkOut" />
                </div>

                {/* Guests */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-[#006699] dark:text-[#00aaff] uppercase tracking-wide">Guests</label>
                  <GuestsFilter />
                </div>
              </div>

              {/* Additional Filters */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Filters</h3>
                    {(() => {
                      const activeFilters = [
                        filters.location,
                        filters.checkIn,
                        filters.checkOut,
                        filters.propertyType,
                        filters.bedrooms > 0,
                        filters.bathrooms > 0,
                        filters.priceRange.min > 0 || filters.priceRange.max < 5000,
                        filters.guests.adults > 1 || filters.guests.children > 0 || filters.guests.infants > 0
                      ].filter(Boolean).length;
                      
                      return activeFilters > 0 ? (
                        <span className="px-2 py-1 bg-[#006699] dark:bg-[#00aaff] text-white text-xs font-medium rounded-full">
                          {activeFilters} active
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => {
                        updateFilters({
                          location: '',
                          checkIn: null,
                          checkOut: null,
                          guests: { adults: 1, children: 0, infants: 0 },
                          propertyType: '',
                          bedrooms: 0,
                          bathrooms: 0,
                          priceRange: { min: 0, max: 5000 },
                          amenities: []
                        });
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm font-medium">Clear All</span>
                    </button>
                    <button 
                      onClick={() => setIsSearchModalOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-[#006699] dark:text-[#00aaff] hover:bg-[#006699]/10 dark:hover:bg-[#00aaff]/10 rounded-lg transition-all duration-200"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="text-sm font-medium">More Filters</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <PropertyTypeFilter />
                  <PriceRangeFilter />
                  <BedroomsFilter />
                  <BathroomsFilter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredProperties.length} properties in UAE
              </h2>
              {filters.location && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  in {filters.location}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Filters
                </span>
              </button>
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Map className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {showMap ? 'Show list' : 'Show map'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={handleFavorite}
                isFavorited={favorites.includes(property.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Show More Button */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Button
            variant="primary"
            size="lg"
            className="px-8 py-3 text-base font-semibold"
          >
            Show more
          </Button>
        </div>
      </section>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={(searchFilters) => {
          console.log('Search filters:', searchFilters);
          setIsSearchModalOpen(false);
        }}
      />
    </div>
  );
};

export default HomePage;
