'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import Button from '../ui/Button';
import { clsx } from 'clsx';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerify,
  onResend,
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Reset and focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Clear OTP inputs when modal opens
      setOtp(['', '', '', '']);
      setError('');
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (!/^\d{4}$/.test(pastedData)) {
      setError('Please paste a valid 4-digit code');
      return;
    }

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputRefs.current[3]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await onVerify(otpString);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await onResend();
      setResendCooldown(60); // 60 seconds cooldown
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verify your email
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#006699]/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-[#006699]" />
            </div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            We've sent a verification code to<br />
            <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* OTP Input */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={clsx(
                    'w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg',
                    'focus:ring-2 focus:ring-[#006699] focus:border-transparent',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    'transition-all',
                    error
                      ? 'border-red-300 dark:border-red-600'
                      : digit
                      ? 'border-[#006699] dark:border-[#006699]'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || otp.join('').length !== 4}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?{' '}
              {resendCooldown > 0 ? (
                <span className="text-gray-500">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-[#006699] hover:text-[#004466] font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;

