'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useFilters } from '../providers/FilterProvider';

interface SearchButtonProps {
  onSearch?: (filters: any) => void;
}

export default function SearchButton({ onSearch }: SearchButtonProps) {
  const { filters } = useFilters();

  const handleSearch = () => {
    // This will be where we integrate with SWR or API calls
    if (onSearch) {
      onSearch(filters);
    } else {
      // Default search behavior - could be replaced with SWR mutation
      console.log('Searching with filters:', filters);
      
      // Example of what SWR integration might look like:
      // mutate(`/api/search?${new URLSearchParams({
      //   location: filters.location,
      //   checkIn: filters.checkIn?.toISOString(),
      //   checkOut: filters.checkOut?.toISOString(),
      //   guests: filters.guests.adults + filters.guests.children,
      //   infants: filters.guests.infants,
      //   minPrice: filters.priceRange.min,
      //   maxPrice: filters.priceRange.max,
      //   propertyType: filters.propertyType,
      //   amenities: filters.amenities.join(','),
      // })}`);
    }
  };

  const hasActiveFilters = 
    filters.location || 
    filters.checkIn || 
    filters.checkOut || 
    filters.guests.adults > 1 || 
    filters.guests.children > 0 || 
    filters.guests.infants > 0;

  return (
    <button
      onClick={handleSearch}
      className={`
        flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 font-medium text-sm
        ${hasActiveFilters
          ? 'bg-[#006699] text-white hover:bg-[#004466] shadow-md'
          : 'bg-[#006699] text-white hover:bg-[#004466]'
        }
      `}
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
    </button>
  );
}


