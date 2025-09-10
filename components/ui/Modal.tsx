'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDark = false,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={clsx(
          'relative w-full rounded-airbnb-lg shadow-airbnb transform transition-all',
          sizeClasses[size],
          isDark 
            ? 'bg-airbnb-card-bg border border-airbnb-border-dark' 
            : 'bg-white border border-airbnb-border'
        )}
      >
        {/* Header */}
        {title && (
          <div className={clsx(
            'flex items-center justify-between p-6 border-b',
            isDark ? 'border-airbnb-border-dark' : 'border-airbnb-border'
          )}>
            <h2 className={clsx(
              'text-lg font-semibold',
              isDark ? 'text-white' : 'text-airbnb-text'
            )}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={clsx(
                'p-2 rounded-full transition-colors',
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-airbnb-text hover:bg-gray-100'
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

