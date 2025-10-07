'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, TrendingUp, Users,
  DollarSign, Home, Star, Filter
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'user_activity' | 'booking' | 'property' | 'review';
  description: string;
  icon: any;
  lastGenerated?: string;
  size?: string;
}

const AdminReportsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState('30d');

  const availableReports: Report[] = [
    {
      id: 'rev_001',
      name: 'Revenue Report',
      type: 'financial',
      description: 'Detailed breakdown of all revenue streams including bookings, commissions, and fees',
      icon: DollarSign,
      lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      size: '2.4 MB',
    },
    {
      id: 'book_001',
      name: 'Bookings Summary',
      type: 'booking',
      description: 'Complete overview of all bookings including status, cancellations, and trends',
      icon: Calendar,
      lastGenerated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      size: '1.8 MB',
    },
    {
      id: 'user_001',
      name: 'User Activity Report',
      type: 'user_activity',
      description: 'User registration, activity patterns, and engagement metrics',
      icon: Users,
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      size: '3.2 MB',
    },
    {
      id: 'prop_001',
      name: 'Property Performance',
      type: 'property',
      description: 'Analysis of property listings, occupancy rates, and performance metrics',
      icon: Home,
      lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      size: '2.1 MB',
    },
    {
      id: 'rev_002',
      name: 'Reviews & Ratings Analysis',
      type: 'review',
      description: 'Comprehensive review statistics, sentiment analysis, and rating trends',
      icon: Star,
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      size: '1.5 MB',
    },
    {
      id: 'fin_001',
      name: 'Commission Breakdown',
      type: 'financial',
      description: 'Platform commission details by host, property, and booking',
      icon: TrendingUp,
      lastGenerated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      size: '1.9 MB',
    },
  ];

  const filteredReports = availableReports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const handleGenerateReport = (report: Report) => {
    alert(`Generating ${report.name}... This would download or send the report.`);
  };

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'financial', label: 'Financial' },
    { value: 'booking', label: 'Bookings' },
    { value: 'user_activity', label: 'User Activity' },
    { value: 'property', label: 'Properties' },
    { value: 'review', label: 'Reviews' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Reports & Analytics" 
          subtitle="Generate and download platform reports"
        />

        <div className="p-8 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{availableReports.length}</p>
                </div>
                <FileText className="h-10 w-10 text-[#006699]" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Financial Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {availableReports.filter(r => r.type === 'financial').length}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">User Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {availableReports.filter(r => r.type === 'user_activity').length}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Booking Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {availableReports.filter(r => r.type === 'booking').length}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-[#006699] to-[#0088cc] rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {report.description}
                      </p>
                      
                      {report.lastGenerated && (
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span>Last generated:</span>
                          <span>{formatDate(report.lastGenerated)}</span>
                        </div>
                      )}

                      {report.size && (
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                          <span>File size:</span>
                          <span>{report.size}</span>
                        </div>
                      )}

                      <Button
                        variant="primary"
                        onClick={() => handleGenerateReport(report)}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Generate Report</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Report Builder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Custom Report Builder
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create a custom report with specific metrics and date ranges
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Revenue Analysis</option>
                  <option>Booking Trends</option>
                  <option>User Engagement</option>
                  <option>Property Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                  <option>Custom</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button variant="primary" className="w-full flex items-center justify-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Build Report</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReportsPage;
