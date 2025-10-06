'use client';

import React from 'react';

interface LoadingResultProps {
  message?: string;
}

const LoadingResult: React.FC<LoadingResultProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699] mx-auto mb-2"></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default LoadingResult;
