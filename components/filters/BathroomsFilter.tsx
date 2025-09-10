'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bath } from 'lucide-react';
import { useFilters } from '../providers/FilterProvider';

const BathroomsFilter: React.FC = () => {
  const { filters, updateFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const bathroomOptions = [
    { value: 0, label: 'Bathrooms' },
    { value: 1, label: '1+ Bathrooms' },
    { value: 2, label: '2+ Bathrooms' },
    { value: 3, label: '3+ Bathrooms' },
    { value: 4, label: '4+ Bathrooms' }
  ];

  const selectedOption = bathroomOptions.find(option => option.value === filters.bathrooms) || bathroomOptions[0];

  const handleSelect = (value: number) => {
    updateFilters({ bathrooms: value });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg border text-left transition-all duration-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-[#006699] dark:hover:border-[#00aaff] focus:outline-none focus:ring-2 focus:ring-[#006699] dark:focus:ring-[#00aaff]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bath className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">
              {selectedOption.label}
            </span>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[9999]">
          <div className="py-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {bathroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  option.value === filters.bathrooms
                    ? 'bg-[#006699] text-white dark:bg-[#00aaff]'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BathroomsFilter;
