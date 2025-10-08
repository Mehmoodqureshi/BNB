'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, Shield, AlertTriangle, Info, CheckCircle, X, Plus, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/app/admin/layout';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onAddProperty?: () => void;
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  action?: { label: string; url: string };
  isRead: boolean;
  createdAt: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, actions, onAddProperty }) => {
  const router = useRouter();
  const { adminUser, logout } = useAdminContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock notifications - in real app, would come from API/context
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      type: 'warning',
      title: 'High Chargeback Rate',
      message: '12 chargebacks in last 7 days - above threshold',
      action: { label: 'Review Cases', url: '/admin/disputes' },
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif_2',
      type: 'info',
      title: 'Properties Pending Approval',
      message: '23 properties waiting for approval',
      action: { label: 'Review Queue', url: '/admin/properties' },
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif_3',
      type: 'warning',
      title: 'Refund Requests',
      message: '8 refund requests pending review',
      action: { label: 'View Refunds', url: '/admin/refunds' },
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif_4',
      type: 'info',
      title: 'Flagged Reviews',
      message: '3 reviews flagged for moderation',
      action: { label: 'Moderate Reviews', url: '/admin/reviews' },
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationAction = (notification: Notification) => {
    if (notification.action) {
      markAsRead(notification.id);
      router.push(notification.action.url);
      setShowNotifications(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {actions}
          
          {/* Add Property Button */}
          {onAddProperty && (
            <button
              onClick={onAddProperty}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#006699] to-[#0088cc] hover:from-[#005588] hover:to-[#0077bb] text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Property</span>
            </button>
          )}
          
          {/* Admin Info with Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              <div className="p-1.5 bg-[#006699] rounded-full">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400">Agency Account</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{adminUser?.name || 'Admin'}</p>
              </div>
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{adminUser?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{adminUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[#006699] text-white rounded-full">
                    Agency
                  </span>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#006699] hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <p className={`text-sm font-semibold ${
                                  !notification.isRead 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.title}
                                </p>
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(notification.createdAt)}
                                </span>
                                {notification.action && (
                                  <button
                                    onClick={() => handleNotificationAction(notification)}
                                    className="text-xs font-medium text-[#006699] hover:underline"
                                  >
                                    {notification.action.label}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button 
                      onClick={() => {
                        router.push('/admin/notifications');
                        setShowNotifications(false);
                      }}
                      className="text-sm text-[#006699] hover:underline font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
