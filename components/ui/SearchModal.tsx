'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { clsx } from 'clsx';
import Modal from './Modal';
import Button from './Button';
import { useTheme } from '../providers/ThemeProvider';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search:', { searchQuery, guests, checkIn, checkOut });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDark={isDark}
      size="lg"
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <label className={clsx(
            'block text-sm font-medium mb-2',
            isDark ? 'text-white' : 'text-airbnb-text'
          )}>
            Where
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations"
              className={clsx(
                'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red',
                isDark 
                  ? 'bg-airbnb-dark-bg border-airbnb-border-dark text-white placeholder-gray-400' 
                  : 'bg-white border-airbnb-border text-airbnb-text placeholder-gray-500'
              )}
            />
          </div>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={clsx(
              'block text-sm font-medium mb-2',
              isDark ? 'text-white' : 'text-airbnb-text'
            )}>
              Check in
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={clsx(
                  'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red',
                  isDark 
                    ? 'bg-airbnb-dark-bg border-airbnb-border-dark text-white' 
                    : 'bg-white border-airbnb-border text-airbnb-text'
                )}
              />
            </div>
          </div>
          <div>
            <label className={clsx(
              'block text-sm font-medium mb-2',
              isDark ? 'text-white' : 'text-airbnb-text'
            )}>
              Check out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={clsx(
                  'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red',
                  isDark 
                    ? 'bg-airbnb-dark-bg border-airbnb-border-dark text-white' 
                    : 'bg-white border-airbnb-border text-airbnb-text'
                )}
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className={clsx(
            'block text-sm font-medium mb-2',
            isDark ? 'text-white' : 'text-airbnb-text'
          )}>
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={clsx(
                'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red',
                isDark 
                  ? 'bg-airbnb-dark-bg border-airbnb-border-dark text-white' 
                  : 'bg-white border-airbnb-border text-airbnb-text'
              )}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSearch}
            isDark={isDark}
            className="px-8"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
