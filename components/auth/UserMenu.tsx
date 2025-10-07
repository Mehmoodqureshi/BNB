'use client';

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Heart, 
  Calendar, 
  MessageCircle, 
  HelpCircle, 
  LogOut, 
  ChevronDown,
  Home,
  Plus,
  Star,
  Shield,
  Globe,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { clsx } from 'clsx';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: () => void;
  onDashboardClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, onProfileClick, onDashboardClick }) => {
  const { user, logout } = useAuth();
  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const menuItems = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      items: [
        { label: 'Personal information', onClick: onProfileClick },
        { label: 'Login & security', onClick: () => console.log('Login & security') },
        { label: 'Payments and payouts', onClick: () => console.log('Payments') },
        { label: 'Taxes', onClick: () => console.log('Taxes') },
        { label: 'Notifications', onClick: () => console.log('Notifications') },
        { label: 'Privacy and sharing', onClick: () => console.log('Privacy') },
        { label: 'Global preferences', onClick: () => console.log('Preferences') }
      ]
    },
    {
      id: 'hosting',
      label: 'Hosting',
      icon: Home,
      items: [
        { label: 'Host Dashboard', onClick: () => { window.location.href = '/host'; onClose(); } },
        { label: 'Manage Properties', onClick: () => { window.location.href = '/host/properties'; onClose(); } },
        { label: 'Calendar Management', onClick: () => { window.location.href = '/host/calendar'; onClose(); } },
        { label: 'Host Analytics', onClick: () => { window.location.href = '/host/analytics'; onClose(); } },
        { label: 'Host Settings', onClick: () => { window.location.href = '/host/settings'; onClose(); } }
      ]
    },
    {
      id: 'travel',
      label: 'Travel',
      icon: Globe,
      items: [
        { label: 'Your trips', onClick: () => console.log('Trips') },
        { label: 'Wishlists', onClick: () => console.log('Wishlists') },
        { label: 'Travel credits', onClick: () => console.log('Travel credits') },
        { label: 'Gift cards', onClick: () => console.log('Gift cards') }
      ]
    }
  ];

  const quickActions = [
    { label: 'Messages', icon: MessageCircle, onClick: () => { window.location.href = '/messages'; onClose(); } },
    { label: 'Bookings', icon: Calendar, onClick: () => { window.location.href = '/bookings'; onClose(); } },
    { label: 'Wishlist', icon: Heart, onClick: () => { window.location.href = '/wishlist'; onClose(); } },
    { label: 'Settings', icon: Settings, onClick: () => { window.location.href = '/settings'; onClose(); } }
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
          {user.isSuperhost && (
            <div className="flex items-center text-purple-600">
              <Shield className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-2 py-2">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => {
              onDashboardClick();
              onClose();
            }}
            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="px-2 py-2">
        {menuItems.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => setShowSubmenu(showSubmenu === section.id ? null : section.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
              </div>
              <ChevronDown 
                className={clsx(
                  'h-4 w-4 transition-transform',
                  showSubmenu === section.id && 'rotate-180'
                )} 
              />
            </button>
            
            {showSubmenu === section.id && (
              <div className="ml-6 mt-1 space-y-1">
                {section.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hosting CTA */}
      {!user.isSuperhost && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              window.location.href = '/host';
              onClose();
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-[#006699] hover:bg-[#006699]/10 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Become a Host</span>
          </button>
        </div>
      )}

      {/* Help & Logout */}
      <div className="px-2 py-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            console.log('Help');
            onClose();
          }}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
