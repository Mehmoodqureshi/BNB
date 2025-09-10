'use client';

import React, { useState } from 'react';
import { Menu, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-7xl mx-auto h-16 justify-between items-center">
          {/* Logo - Left */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-[#006699] flex ">
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

            <button className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              Become a Host
            </button>

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white hover:bg-[#004466] rounded-full transition-colors shadow-md"
              >
                <Menu className="h-4 w-4" />
                <User className="h-4 w-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Sign up
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Log in
                  </a>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Host your home
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    Help
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;