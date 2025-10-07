'use client';

import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Eye,
  Lock, Key, UserX, Activity, Clock
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'suspicious_activity' | 'blocked_user' | 'password_reset' | 'data_breach_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  ipAddress: string;
  description: string;
  timestamp: string;
  status: 'resolved' | 'investigating' | 'pending';
}

const AdminSecurityPage: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: 'sec_001',
      type: 'login_attempt',
      severity: 'high',
      user: 'emily.chen@email.com',
      ipAddress: '192.168.1.100',
      description: 'Multiple failed login attempts (5 attempts in 2 minutes)',
      timestamp: new Date().toISOString(),
      status: 'resolved',
    },
    {
      id: 'sec_002',
      type: 'suspicious_activity',
      severity: 'critical',
      user: 'john.doe@email.com',
      ipAddress: '203.45.67.89',
      description: 'Unusual booking pattern detected - 10 bookings in 5 minutes',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'investigating',
    },
    {
      id: 'sec_003',
      type: 'blocked_user',
      severity: 'medium',
      user: 'suspicious.user@email.com',
      ipAddress: '45.67.89.123',
      description: 'User blocked due to fraudulent payment attempts',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
    },
    {
      id: 'sec_004',
      type: 'password_reset',
      severity: 'low',
      user: 'sarah.johnson@email.com',
      ipAddress: '172.16.0.45',
      description: 'Password reset requested and completed',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
    },
  ]);

  const filteredEvents = securityEvents.filter(event => {
    const matchesSeverity = selectedSeverity === 'all' || event.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesSeverity && matchesType;
  });

  const getSeverityBadge = (severity: string) => {
    const styles = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return styles[severity as keyof typeof styles] || styles.medium;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      investigating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login_attempt':
        return <Lock className="h-5 w-5 text-blue-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'blocked_user':
        return <UserX className="h-5 w-5 text-orange-600" />;
      case 'password_reset':
        return <Key className="h-5 w-5 text-green-600" />;
      case 'data_breach_attempt':
        return <Shield className="h-5 w-5 text-purple-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    totalEvents: securityEvents.length,
    critical: securityEvents.filter(e => e.severity === 'critical').length,
    investigating: securityEvents.filter(e => e.status === 'investigating').length,
    resolved: securityEvents.filter(e => e.status === 'resolved').length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Security & Monitoring" 
          subtitle="Monitor security events and suspicious activities"
        />

        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalEvents}</p>
                  <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
                </div>
                <Activity className="h-10 w-10 text-[#006699]" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-md border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">Critical</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-white mt-1">{stats.critical}</p>
                  <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 shadow-md border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Investigating</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-white mt-1">{stats.investigating}</p>
                  <p className="text-xs text-yellow-600 mt-1">Under review</p>
                </div>
                <Eye className="h-10 w-10 text-yellow-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-md border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">{stats.resolved}</p>
                  <p className="text-xs text-green-600 mt-1">Successfully handled</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="login_attempt">Login Attempts</option>
                <option value="suspicious_activity">Suspicious Activity</option>
                <option value="blocked_user">Blocked Users</option>
                <option value="password_reset">Password Resets</option>
                <option value="data_breach_attempt">Data Breach Attempts</option>
              </select>
            </div>
          </div>

          {/* Security Events Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          {getTypeIcon(event.type)}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {event.type.replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{event.user}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-gray-900 dark:text-white">{event.ipAddress}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadge(event.severity)}`}>
                          {event.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(event.timestamp)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="secondary" className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>Details</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredEvents.length} of {securityEvents.length} events
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-[#006699] text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSecurityPage;
