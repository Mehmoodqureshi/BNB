'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, Minus, ChevronDown } from 'lucide-react';
import { useFilters } from '../providers/FilterProvider';

interface GuestsFilterProps {
  isActive?: boolean;
  onClick?: () => void;
}

export default function GuestsFilter({ isActive = false, onClick }: GuestsFilterProps) {
  const { filters, updateFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [localGuests, setLocalGuests] = useState(filters.guests);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync local state with global state when filters change
  useEffect(() => {
    setLocalGuests(filters.guests);
  }, [filters.guests]);

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

  const totalGuests = localGuests.adults + localGuests.children + localGuests.infants;

  const updateGuestCount = (type: keyof typeof localGuests, delta: number) => {
    const newCount = Math.max(0, localGuests[type] + delta);
    
    // Adults must be at least 1
    if (type === 'adults' && newCount < 1) return;
    
    // Infants can't exceed adults
    if (type === 'infants' && newCount > localGuests.adults) return;
    
    const newGuests = { ...localGuests, [type]: newCount };
    setLocalGuests(newGuests);
    // Don't update global filters immediately - wait for Apply button
  };

  const getGuestText = () => {
    if (totalGuests === 0) return 'Add guests';
    if (totalGuests === 1) return '1 guest';
    return `${totalGuests} guests`;
  };

  const handleApply = () => {
    updateFilters({ guests: localGuests });
    setIsOpen(false);
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
          w-full px-3 py-2 rounded-l-xl border text-left transition-all duration-200 bg-white dark:bg-gray-800
          ${(isActive || isOpen)
            ? 'border-[#006699] shadow-lg' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className={`h-5 w-5 ${totalGuests > 0 ? 'text-[#006699] dark:text-[#00aaff]' : 'text-gray-500 dark:text-gray-400'}`} />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Guests
              </div>
              <div className={`text-sm font-medium truncate ${
                totalGuests > 0
                  ? 'text-[#006699] dark:text-[#00aaff] font-semibold' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {getGuestText()}
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

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[9999] p-6 min-w-80">
          <div className="space-y-6">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Adults</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Ages 13 or above</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateGuestCount('adults', -1)}
                  disabled={localGuests.adults <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-[#006699] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {localGuests.adults}
                </span>
                <button
                  onClick={() => updateGuestCount('adults', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-[#006699] transition-colors text-gray-600 dark:text-gray-400"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Children</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Ages 2-12</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateGuestCount('children', -1)}
                  disabled={localGuests.children <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-[#006699] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {localGuests.children}
                </span>
                <button
                  onClick={() => updateGuestCount('children', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-[#006699] transition-colors text-gray-600 dark:text-gray-400"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Infants</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Under 2</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateGuestCount('infants', -1)}
                  disabled={localGuests.infants <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-[#006699] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {localGuests.infants}
                </span>
                <button
                  onClick={() => updateGuestCount('infants', 1)}
                  disabled={localGuests.infants >= localGuests.adults}
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-[#006699] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              onClick={() => {
                setLocalGuests({ adults: 1, children: 0, infants: 0 });
                updateFilters({ guests: { adults: 1, children: 0, infants: 0 } });
                setIsOpen(false);
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#004466] transition-colors text-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


