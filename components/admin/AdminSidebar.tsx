'use client';

import React from 'react';
import { 
  LayoutDashboard, Users, Home, Calendar, DollarSign, 
  Star, MessageSquare, Settings, BarChart3, AlertTriangle,
  Shield, FileText, TrendingUp
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', badge: null },
        { label: 'Analytics', icon: BarChart3, path: '/admin/analytics', badge: null },
      ]
    },
    {
      section: 'Management',
      items: [
        { label: 'Hosts', icon: Users, path: '/admin/hosts', badge: null },
        { label: 'Properties', icon: Home, path: '/admin/properties', badge: 5 }, // Pending approval
        { label: 'Bookings', icon: Calendar, path: '/admin/bookings', badge: null },
        { label: 'Reviews', icon: Star, path: '/admin/reviews', badge: 3 }, // Flagged
      ]
    },
    {
      section: 'Financial',
      items: [
        { label: 'Payments', icon: DollarSign, path: '/admin/payments', badge: null },
        { label: 'Refunds', icon: TrendingUp, path: '/admin/refunds', badge: 8 }, // Pending
        { label: 'Disputes', icon: AlertTriangle, path: '/admin/disputes', badge: 2 },
      ]
    },
    {
      section: 'System',
      items: [
        { label: 'Reports', icon: FileText, path: '/admin/reports', badge: null },
        { label: 'Settings', icon: Settings, path: '/admin/settings', badge: null },
        { label: 'Security', icon: Shield, path: '/admin/security', badge: null },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 overflow-y-auto">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-[#006699] to-[#0088cc] rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Platform Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#006699] text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
            Quick Stats
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-bold text-gray-900 dark:text-white">1,234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Today's Revenue</span>
              <span className="font-bold text-green-600">AED 45.2k</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pending Actions</span>
              <span className="font-bold text-red-600">18</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
