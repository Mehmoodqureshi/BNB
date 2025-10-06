'use client';

import React, { useState } from 'react';
import { X, Search, MapPin, Calendar, Users } from 'lucide-react';
import { useFilters } from '../providers/FilterProvider';
import LocationFilter from './LocationFilter';
import DateFilter from './DateFilter';
import GuestsFilter from './GuestsFilter';
import SearchButton from './SearchButton';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (filters: any) => void;
}

export default function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const { filters, updateFilters, resetFilters } = useFilters();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (searchFilters: any) => {
    if (onSearch) {
      onSearch(searchFilters);
    }
    onClose();
  };

  const handleReset = () => {
    resetFilters();
    setActiveFilter(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search and filter</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Location */}
            <div className="relative">
              <LocationFilter
                isActive={activeFilter === 'location'}
                onClick={() => setActiveFilter(activeFilter === 'location' ? null : 'location')}
              />
            </div>

            {/* Check In */}
            <div className="relative">
              <DateFilter
                type="checkIn"
                isActive={activeFilter === 'checkIn'}
                onClick={() => setActiveFilter(activeFilter === 'checkIn' ? null : 'checkIn')}
              />
            </div>

            {/* Check Out */}
            <div className="relative">
              <DateFilter
                type="checkOut"
                isActive={activeFilter === 'checkOut'}
                onClick={() => setActiveFilter(activeFilter === 'checkOut' ? null : 'checkOut')}
              />
            </div>

            {/* Guests */}
            <div className="relative">
              <GuestsFilter
                isActive={activeFilter === 'guests'}
                onClick={() => setActiveFilter(activeFilter === 'guests' ? null : 'guests')}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick filters</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Free cancellation',
                'Wifi',
                'Kitchen',
                'Washer',
                'Dryer',
                'Air conditioning',
                'Pool',
                'Hot tub',
                'Parking',
                'Gym',
                'Concierge',
                'Valet Parking',
                'Sea View',
                'Marina View',
                'City View',
                'Golf Course View',
                'Private Beach',
                'BBQ Area',
                'Garden',
                'Maid\'s Room',
                'Study Room',
                'Spa',
                'Golf Course',
                'Corniche View'
              ].map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => {
                    const currentAmenities = filters.amenities;
                    const isSelected = currentAmenities.includes(amenity);
                    const newAmenities = isSelected
                      ? currentAmenities.filter((a: string) => a !== amenity)
                      : [...currentAmenities, amenity];
                    updateFilters({ amenities: newAmenities });
                  }}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                    ${filters.amenities.includes(amenity)
                      ? 'bg-[#006699] text-white border-[#006699] shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#006699] hover:bg-[#006699]/5 dark:hover:bg-[#006699]/10'
                    }
                  `}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Price range (AED per night)</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Min price (AED)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={filters.priceRange.min === 0 ? '' : filters.priceRange.min || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                      updateFilters({
                        priceRange: { ...filters.priceRange, min: value }
                      });
                    }}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-[#006699] bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">AED</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max price (AED)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={filters.priceRange.max === 5000 ? '' : filters.priceRange.max || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 5000 : parseInt(e.target.value) || 5000;
                      updateFilters({
                        priceRange: { ...filters.priceRange, max: value }
                      });
                    }}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-[#006699] bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="5000"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">AED</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Typical range: AED 200-2000 per night
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleReset}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline"
          >
            Clear all
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <SearchButton onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}


