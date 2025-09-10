'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useFilters } from '../providers/FilterProvider';

interface DateFilterProps {
  type: 'checkIn' | 'checkOut';
  isActive?: boolean;
  onClick?: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ type, isActive = false, onClick }) => {
  const { filters, updateFilters } = useFilters();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  const handleDateSelect = (date: Date) => {
    if (type === 'checkIn') {
      updateFilters({ checkIn: date });
    } else {
      updateFilters({ checkOut: date });
    }
    setSelectedDate(date);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (type === 'checkIn') {
      return filters.checkIn ? filters.checkIn.toLocaleDateString() : 'Add dates';
    } else {
      return filters.checkOut ? filters.checkOut.toLocaleDateString() : 'Add dates';
    }
  };

  const getLabel = () => {
    return type === 'checkIn' ? 'Check in' : 'Check out';
  };

  // Calendar generation functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (type === 'checkOut' && filters.checkIn) {
      const nextDay = new Date(filters.checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return date < nextDay;
    }
    
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (type === 'checkIn') {
      return filters.checkIn && date.toDateString() === filters.checkIn.toDateString();
    } else {
      return filters.checkOut && date.toDateString() === filters.checkOut.toDateString();
    }
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
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
            <Calendar className={`h-5 w-5 ${(type === 'checkIn' ? filters.checkIn : filters.checkOut) ? 'text-[#006699] dark:text-[#00aaff]' : 'text-gray-500 dark:text-gray-400'}`} />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                {getLabel()}
              </div>
              <div className={`text-sm font-medium truncate ${
                (type === 'checkIn' ? filters.checkIn : filters.checkOut)
                  ? 'text-[#006699] dark:text-[#00aaff] font-semibold' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {getDisplayText()}
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[9999] w-80">
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Select {getLabel().toLowerCase()} date
              </label>
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((date, index) => {
                  if (!date) {
                    return <div key={index} className="h-8" />;
                  }

                  const isDisabled = isDateDisabled(date);
                  const isSelected = isDateSelected(date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => !isDisabled && handleDateSelect(date)}
                      disabled={isDisabled}
                      className={`
                        h-8 w-8 rounded-lg text-sm font-medium transition-colors
                        ${isSelected
                          ? 'bg-[#006699] text-white'
                          : isToday
                          ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                          : isDisabled
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {type === 'checkIn' 
                ? 'Choose your arrival date'
                : 'Choose your departure date'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
