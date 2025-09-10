'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Guests {
  adults: number;
  children: number;
  infants: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface Filters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: Guests;
  priceRange: PriceRange;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

interface FilterContextType {
  filters: Filters;
  updateFilters: (newFilters: Partial<Filters>) => void;
  resetFilters: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const defaultFilters: Filters = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: {
    adults: 1,
    children: 0,
    infants: 0
  },
  priceRange: {
    min: 0,
    max: 5000
  },
  propertyType: '',
  bedrooms: 0,
  bathrooms: 0,
  amenities: []
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const value: FilterContextType = {
    filters,
    updateFilters,
    resetFilters,
    isSearchOpen,
    setIsSearchOpen
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
