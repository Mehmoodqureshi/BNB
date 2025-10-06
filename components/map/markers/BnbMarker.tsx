'use client';

import React from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  agency_id?: string;
  rent?: number;
  lat?: number;
  lng?: number;
}

interface BnbMarkerProps {
  property: Property;
  isSelected?: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}

const BnbMarker: React.FC<BnbMarkerProps> = ({ 
  property, 
  isSelected = false, 
  onClick, 
  onHover, 
  onLeave 
}) => {
  const price = property.rent || property.price;
  const currency = property.currency || 'AED';

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 transform hover:scale-110
        ${isSelected ? 'z-20' : 'z-10'}
      `}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 px-3 py-1 min-w-[60px] text-center
          ${isSelected 
            ? 'border-[#006699] shadow-xl scale-110' 
            : 'border-gray-300 dark:border-gray-600 hover:border-[#006699]'
          }
        `}
      >
        <div className="text-xs font-semibold text-gray-900 dark:text-white">
          {currency} {price}
        </div>
      </div>
      
      {/* Arrow pointing down */}
      <div
        className={`
          absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0
          ${isSelected ? 'border-t-[#006699]' : 'border-t-gray-300 dark:border-t-gray-600'}
          border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent
        `}
      />
    </div>
  );
};

export default BnbMarker;
