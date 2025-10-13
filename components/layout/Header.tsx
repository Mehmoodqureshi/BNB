'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useAuth } from '../providers/AuthProvider';
import AuthModal from '../auth/AuthModal';
import UserMenu from '../auth/UserMenu';
import UserProfile from '../auth/UserProfile';
import UserDashboard from '../auth/UserDashboard';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleDashboardClick = () => {
    window.location.href = '/dashboard';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex max-w-7xl mx-auto h-16 justify-between items-center">
            {/* Logo - Left */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#006699] flex cursor-pointer">
                <div className="w-8 h-8 bg-[#006699] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                BNB
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Sun className="h-5 w-5 text-yellow-400 dark:block hidden" />
                <Moon className="h-5 w-5 text-gray-600 dark:hidden block" />
              </button>

              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => window.location.href = '/host'}
                    className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Become a Host
                  </button>

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:shadow-md transition-all"
                    >
                      <Menu className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <img
                        src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </button>

                    <UserMenu
                      isOpen={isUserMenuOpen}
                      onClose={() => setIsUserMenuOpen(false)}
                      onProfileClick={handleProfileClick}
                      onDashboardClick={handleDashboardClick}
                    />
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => router.push('/host/login')}
                    className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Become a Host
                  </button>

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white hover:bg-[#004466] rounded-full transition-colors shadow-md"
                    >
                      <Menu className="h-4 w-4" />
                      <User className="h-4 w-4" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                        <button
                          onClick={() => handleAuthClick('register')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Sign up
                        </button>
                        <button
                          onClick={() => handleAuthClick('login')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Log in
                        </button>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={() => {
                            router.push('/host/login');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Host your home
                        </button>
                        <button
                          onClick={() => {
                            console.log('Help');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Help
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* User Profile Modal */}
      {isAuthenticated && (
        <UserProfile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* User Dashboard Modal */}
      {isAuthenticated && (
        <UserDashboard
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
        />
      )}
    </>
  );
};

export default Header;