'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { useFilters } from '../providers/FilterProvider';

interface LocationFilterProps {
  isActive?: boolean;
  onClick?: () => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ isActive = false, onClick }) => {
  const { filters, updateFilters } = useFilters();
  const [searchQuery, setSearchQuery] = useState(filters.location);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
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


  const popularDestinations = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Ras Al Khaimah',
    'Fujairah',
    'Umm Al Quwain'
  ];

  const dubaiAreas = [
    'Downtown Dubai',
    'Dubai Marina',
    'Palm Jumeirah',
    'JBR (Jumeirah Beach Residence)',
    'Business Bay',
    'DIFC (Dubai International Financial Centre)',
    'JLT (Jumeirah Lake Towers)',
    'JVC (Jumeirah Village Circle)',
    'Arabian Ranches',
    'Dubai Hills',
    'Dubai Sports City',
    'Dubai Silicon Oasis',
    'International City',
    'Discovery Gardens',
    'Jumeirah',
    'Al Barsha',
    'Al Quoz',
    'Deira',
    'Bur Dubai',
    'Karama'
  ];

  const abuDhabiAreas = [
    'Corniche',
    'Al Reem Island',
    'Saadiyat Island',
    'Yas Island',
    'Al Raha Beach',
    'Khalifa City',
    'Al Reef',
    'Al Raha Gardens',
    'Al Bandar',
    'Al Muneera',
    'Al Zeina',
    'Al Ghadeer',
    'Masdar City',
    'Al Maryah Island',
    'Al Ain'
  ];

  const [filteredResults, setFilteredResults] = useState<{
    emirates: string[];
    dubaiAreas: string[];
    abuDhabiAreas: string[];
  }>({
    emirates: popularDestinations,
    dubaiAreas: dubaiAreas,
    abuDhabiAreas: abuDhabiAreas
  });

  const handleLocationSelect = (location: string) => {
    updateFilters({ location });
    setSearchQuery(location);
  };

  // Filter results based on search query
  const filterResults = (query: string) => {
    if (!query.trim()) {
      setFilteredResults({
        emirates: popularDestinations,
        dubaiAreas: dubaiAreas,
        abuDhabiAreas: abuDhabiAreas
      });
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    setFilteredResults({
      emirates: popularDestinations.filter(dest => 
        dest.toLowerCase().includes(lowerQuery)
      ),
      dubaiAreas: dubaiAreas.filter(area => 
        area.toLowerCase().includes(lowerQuery)
      ),
      abuDhabiAreas: abuDhabiAreas.filter(area => 
        area.toLowerCase().includes(lowerQuery)
      )
    });
  };

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterResults(query);
  };


  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        className={`
          w-full px-3 py-2 rounded-lg border text-left transition-all duration-200 bg-white dark:bg-gray-800
          ${(isActive || isOpen)
            ? 'border-[#006699] shadow-lg' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className={`h-5 w-5 ${filters.location ? 'text-[#006699] dark:text-[#00aaff]' : 'text-gray-500 dark:text-gray-400'}`} />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Where
              </div>
              <div className={`text-sm font-medium truncate ${
                filters.location 
                  ? 'text-[#006699] dark:text-[#00aaff] font-semibold' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {filters.location || 'Search destinations'}
              </div>
            </div>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {(isActive || isOpen) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[9999] max-h-96 overflow-hidden">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search destinations"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
              />
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {/* Emirates */}
              {filteredResults.emirates.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Emirates</h4>
                  <div className="space-y-1">
                    {filteredResults.emirates.map((destination) => (
                      <button
                        key={destination}
                        onClick={() => handleLocationSelect(destination)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                      >
                        {highlightText(destination, searchQuery)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dubai Areas */}
              {filteredResults.dubaiAreas.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Dubai Areas</h4>
                  <div className="space-y-1">
                    {filteredResults.dubaiAreas.map((area) => (
                      <button
                        key={area}
                        onClick={() => handleLocationSelect(`${area}, Dubai`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                      >
                        {highlightText(area, searchQuery)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Abu Dhabi Areas */}
              {filteredResults.abuDhabiAreas.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Abu Dhabi Areas</h4>
                  <div className="space-y-1">
                    {filteredResults.abuDhabiAreas.map((area) => (
                      <button
                        key={area}
                        onClick={() => handleLocationSelect(`${area}, Abu Dhabi`)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                      >
                        {highlightText(area, searchQuery)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredResults.emirates.length === 0 && 
               filteredResults.dubaiAreas.length === 0 && 
               filteredResults.abuDhabiAreas.length === 0 && 
               searchQuery.trim() && (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    No destinations found for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
