'use client';

import React from 'react';
import { 
  CheckCircle, 
  Mail, 
  Phone, 
  Shield, 
  Award, 
  Clock, 
  Star,
  MessageCircle,
  Camera,
  MapPin
} from 'lucide-react';
import { clsx } from 'clsx';

interface VerificationBadge {
  id: string;
  type: 'email' | 'phone' | 'government_id' | 'superhost' | 'response_rate' | 'response_time' | 'photo' | 'location';
  title: string;
  description: string;
  verified: boolean;
  value?: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface VerificationBadgesProps {
  user: {
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isGovernmentIdVerified: boolean;
    isSuperhost: boolean;
    responseRate?: number;
    responseTime?: string;
    profilePicture?: string;
    location?: string;
  };
  showAll?: boolean;
  className?: string;
}

const VerificationBadges: React.FC<VerificationBadgesProps> = ({ 
  user, 
  showAll = false, 
  className 
}) => {
  const badges: VerificationBadge[] = [
    {
      id: 'email',
      type: 'email',
      title: 'Email verified',
      description: 'Email address confirmed',
      verified: user.isEmailVerified,
      icon: <Mail className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'phone',
      type: 'phone',
      title: 'Phone verified',
      description: 'Phone number confirmed',
      verified: user.isPhoneVerified,
      icon: <Phone className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'government_id',
      type: 'government_id',
      title: 'Government ID verified',
      description: 'Identity document confirmed',
      verified: user.isGovernmentIdVerified,
      icon: <Shield className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'superhost',
      type: 'superhost',
      title: 'Superhost',
      description: 'Verified Superhost status',
      verified: user.isSuperhost,
      icon: <Award className="h-4 w-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'response_rate',
      type: 'response_rate',
      title: 'Response rate',
      description: 'Message response rate',
      verified: true,
      value: user.responseRate ? `${user.responseRate}%` : 'N/A',
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'text-[#006699]',
      bgColor: 'bg-[#006699]/10'
    },
    {
      id: 'response_time',
      type: 'response_time',
      title: 'Response time',
      description: 'Average response time',
      verified: true,
      value: user.responseTime || 'N/A',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-[#006699]',
      bgColor: 'bg-[#006699]/10'
    },
    {
      id: 'photo',
      type: 'photo',
      title: 'Profile photo',
      description: 'Profile picture uploaded',
      verified: !!user.profilePicture,
      icon: <Camera className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'location',
      type: 'location',
      title: 'Location added',
      description: 'Location information provided',
      verified: !!user.location,
      icon: <MapPin className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const displayBadges = showAll ? badges : badges.filter(badge => badge.verified);

  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {displayBadges.map((badge) => (
        <div
          key={badge.id}
          className={clsx(
            'inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium border transition-all',
            badge.verified
              ? `${badge.color} ${badge.bgColor} border-current/20`
              : 'text-gray-500 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          )}
        >
          <div className={clsx(
            'flex items-center',
            badge.verified ? badge.color : 'text-gray-400'
          )}>
            {badge.verified ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              badge.icon
            )}
          </div>
          <span className="truncate max-w-32">
            {badge.title}
            {badge.value && (
              <span className="ml-1 font-semibold">
                {badge.value}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default VerificationBadges;
