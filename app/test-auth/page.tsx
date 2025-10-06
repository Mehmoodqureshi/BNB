'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import AuthModal from '@/components/auth/AuthModal';
import UserProfile from '@/components/auth/UserProfile';
import UserDashboard from '@/components/auth/UserDashboard';
import Button from '@/components/ui/Button';

export default function TestAuthPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Test Page
        </h1>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Status
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
            </p>
            {user && (
              <>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>User:</strong> {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Superhost:</strong> {user.isSuperhost ? '✅ Yes' : '❌ No'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Test Credentials */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Test Credentials
          </h2>
          <div className="space-y-2 text-blue-800 dark:text-blue-200">
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {!isAuthenticated ? (
            <Button
              variant="primary"
              onClick={() => setShowAuthModal(true)}
              className="w-full"
            >
              Login
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => setShowProfile(true)}
                className="w-full"
              >
                View Profile
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDashboard(true)}
                className="w-full"
              >
                View Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="w-full"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* User Data Display */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Data
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {/* Modals */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />

        {isAuthenticated && (
          <>
            <UserProfile
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
            />
            <UserDashboard
              isOpen={showDashboard}
              onClose={() => setShowDashboard(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}
