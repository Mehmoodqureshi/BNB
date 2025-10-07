'use client';

import React, { useState } from 'react';
import { 
  Calendar, X, Save, ChevronLeft, ChevronRight, DollarSign, 
  Clock, Ban, Check, Settings, TrendingUp, AlertCircle, Info
} from 'lucide-react';

interface CalendarDate {
  date: Date;
  status: 'available' | 'blocked' | 'booked' | 'pending';
  price?: number;
  bookingId?: string;
  note?: string;
  minimumStay?: number;
}

interface CalendarManagementProps {
  onClose: () => void;
}

const CalendarManagement: React.FC<CalendarManagementProps> = ({ onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState('property-1');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarData, setCalendarData] = useState<Map<string, CalendarDate>>(new Map());
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [customPrice, setCustomPrice] = useState<number>(450);
  const [blockReason, setBlockReason] = useState('');
  const [minimumStay, setMinimumStay] = useState(1);
  const [basePrice, setBasePrice] = useState(450);

  const properties = [
    { id: 'property-1', name: 'Luxury Apartment in Downtown Dubai', basePrice: 450 },
    { id: 'property-2', name: 'Beachfront Villa on Palm Jumeirah', basePrice: 1200 },
    { id: 'property-3', name: 'Modern Studio in Marina', basePrice: 350 }
  ];

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDateStatus = (date: Date): 'available' | 'blocked' | 'booked' | 'pending' => {
    const dateKey = formatDateKey(date);
    const data = calendarData.get(dateKey);
    if (data) return data.status;
    
    // Mock some booked dates
    const day = date.getDate();
    if (day >= 3 && day <= 5) return 'booked';
    if (day >= 11 && day <= 12) return 'pending';
    if (day === 6 || day === 7) return 'blocked';
    
    return 'available';
  };

  const getDatePrice = (date: Date): number => {
    const dateKey = formatDateKey(date);
    const data = calendarData.get(dateKey);
    if (data?.price) return data.price;
    
    // Weekend pricing (Friday-Saturday)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return Math.round(basePrice * 1.3);
    }
    
    return basePrice;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50';
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 cursor-not-allowed';
      case 'booked':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 cursor-not-allowed';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 cursor-not-allowed';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date);
    if (status === 'booked' || status === 'pending') return;
    
    const dateKey = formatDateKey(date);
    const isSelected = selectedDates.some(d => formatDateKey(d) === dateKey);
    
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => formatDateKey(d) !== dateKey));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleBlockDates = () => {
    selectedDates.forEach(date => {
      const dateKey = formatDateKey(date);
      calendarData.set(dateKey, {
        date,
        status: 'blocked',
        note: blockReason
      });
    });
    setCalendarData(new Map(calendarData));
    setSelectedDates([]);
    setShowBlockModal(false);
    setBlockReason('');
  };

  const handleUnblockDates = () => {
    selectedDates.forEach(date => {
      const dateKey = formatDateKey(date);
      calendarData.delete(dateKey);
    });
    setCalendarData(new Map(calendarData));
    setSelectedDates([]);
  };

  const handleSetPricing = () => {
    selectedDates.forEach(date => {
      const dateKey = formatDateKey(date);
      const existing = calendarData.get(dateKey) || { date, status: 'available' };
      calendarData.set(dateKey, {
        ...existing,
        price: customPrice,
        minimumStay
      });
    });
    setCalendarData(new Map(calendarData));
    setSelectedDates([]);
    setShowPricingModal(false);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Calendar Management</h2>
                <p className="text-blue-100 text-sm">Manage availability, pricing, and booking rules</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          {/* Left Sidebar - Controls */}
          <div className="space-y-4">
            {/* Property Selection */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Property
              </label>
              <select 
                value={selectedProperty}
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                  const prop = properties.find(p => p.id === e.target.value);
                  if (prop) setBasePrice(prop.basePrice);
                }}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white font-medium"
              >
                {properties.map(prop => (
                  <option key={prop.id} value={prop.id}>{prop.name}</option>
                ))}
              </select>
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Base Price</span>
                  <span className="text-lg font-bold text-[#006699] dark:text-blue-400">
                    AED {selectedPropertyData?.basePrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Status Legend</span>
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Available for booking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Pending approval</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Blocked/Unavailable</span>
                </div>
              </div>
            </div>

            {/* Selected Dates Info */}
            {selectedDates.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedDates.length} Date{selectedDates.length > 1 ? 's' : ''} Selected
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Choose an action for the selected dates
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#006699] hover:bg-[#005588] text-white rounded-lg transition-colors font-medium"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Set Pricing</span>
                  </button>
                  <button
                    onClick={() => setShowBlockModal(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Block Dates</span>
                  </button>
                  <button
                    onClick={handleUnblockDates}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Check className="h-4 w-4" />
                    <span>Unblock Dates</span>
                  </button>
                  <button
                    onClick={() => setSelectedDates([])}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowRulesModal(true)}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                >
                  <Settings className="h-4 w-4" />
                  <span>Booking Rules</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {monthYear}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square"></div>;
                  }

                  const status = getDateStatus(date);
                  const price = getDatePrice(date);
                  const dateKey = formatDateKey(date);
                  const isSelected = selectedDates.some(d => formatDateKey(d) === dateKey);
                  const isToday = dateKey === formatDateKey(new Date());

                  return (
                    <button
                      key={dateKey}
                      onClick={() => handleDateClick(date)}
                      disabled={status === 'booked' || status === 'pending'}
                      className={`
                        aspect-square p-2 rounded-xl border-2 transition-all
                        ${getStatusColor(status)}
                        ${isSelected ? 'ring-2 ring-[#006699] ring-offset-2 dark:ring-offset-gray-800 scale-95' : ''}
                        ${isToday ? 'border-[#006699] dark:border-blue-400 font-bold' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-sm font-semibold">{date.getDate()}</span>
                        <span className="text-xs mt-1">AED {price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Info Text */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Click on available dates to select them, then use the actions on the left to manage pricing or availability.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Changes are saved automatically
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
              <button
                className="px-6 py-2.5 bg-gradient-to-r from-[#006699] to-[#0088cc] text-white rounded-xl hover:from-[#005588] hover:to-[#006699] transition-all font-semibold flex items-center space-x-2"
                onClick={() => {
                  onClose();
                  alert('Calendar changes saved successfully!');
                }}
              >
                <Save className="h-5 w-5" />
                <span>Save & Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Set Custom Pricing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                For {selectedDates.length} selected date{selectedDates.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price per Night (AED)
                </label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white font-semibold text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Stay (Nights)
                </label>
                <input
                  type="number"
                  value={minimumStay}
                  onChange={(e) => setMinimumStay(Number(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowPricingModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetPricing}
                className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors font-medium"
              >
                Apply Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Dates Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Block Dates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Block {selectedDates.length} selected date{selectedDates.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g., Personal use, Maintenance, etc."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockDates}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Block Dates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Rules</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Set default rules for {selectedPropertyData?.name}
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Minimum Stay (Nights)
                </label>
                <input
                  type="number"
                  defaultValue={1}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Stay (Nights)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Advance Booking Window (Days)
                </label>
                <input
                  type="number"
                  defaultValue={365}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preparation Time Between Bookings (Days)
                </label>
                <input
                  type="number"
                  defaultValue={1}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Weekend Minimum Stay</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Require longer stays for weekends</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#006699]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Instant Booking</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow guests to book without approval</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#006699]"></div>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRulesModal(false);
                  alert('Booking rules saved successfully!');
                }}
                className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors font-medium"
              >
                Save Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManagement;

