'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Ban, CheckCircle, 
  XCircle, Eye, Mail, Shield, AlertTriangle, Download
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { UserManagementRecord } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'guest' | 'host' | 'both'>('all');
  const [selectedUser, setSelectedUser] = useState<UserManagementRecord | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  // Mock users data
  const [users] = useState<UserManagementRecord[]>([
    {
      id: 'user_1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+971 50 123 4567',
      role: 'both',
      status: 'active',
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdVerified: true,
      joinedDate: '2024-01-15',
      lastActive: new Date().toISOString(),
      totalBookings: 12,
      totalSpent: 145000,
      totalEarnings: 89000,
      averageRating: 4.8,
      reviewCount: 24,
      flags: [],
    },
    {
      id: 'user_2',
      firstName: 'Mohammed',
      lastName: 'Al-Zahra',
      email: 'mohammed.zahra@email.com',
      phone: '+971 55 987 6543',
      role: 'host',
      status: 'active',
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdVerified: false,
      joinedDate: '2023-11-20',
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      totalBookings: 45,
      totalSpent: 0,
      totalEarnings: 234000,
      averageRating: 4.9,
      reviewCount: 67,
      flags: [],
    },
    {
      id: 'user_3',
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.chen@email.com',
      role: 'guest',
      status: 'suspended',
      isEmailVerified: true,
      isPhoneVerified: false,
      isIdVerified: false,
      joinedDate: '2024-08-01',
      lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      totalBookings: 3,
      totalSpent: 12000,
      averageRating: 3.2,
      reviewCount: 5,
      flags: [
        {
          type: 'multiple_cancellations',
          severity: 'medium',
          description: '3 cancellations in last month',
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      banned: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      pending_verification: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      guest: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      host: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      both: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
    return styles[role as keyof typeof styles] || styles.guest;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 100).toLocaleString()}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="User Management" 
          subtitle="Manage all platform users"
          actions={
            <Button variant="primary" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Users</span>
            </Button>
          }
        />

        <div className="p-8 space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="guest">Guest</option>
                <option value="host">Host</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-[#006699] to-[#0088cc] rounded-full flex items-center justify-center text-white font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                        {user.flags.length > 0 && (
                          <div className="mt-1">
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {user.flags.length} flag{user.flags.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {user.isEmailVerified ? (
                            <span title="Email verified">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </span>
                          ) : (
                            <span title="Email not verified">
                              <XCircle className="h-4 w-4 text-gray-400" />
                            </span>
                          )}
                          {user.isPhoneVerified ? (
                            <span title="Phone verified">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </span>
                          ) : (
                            <span title="Phone not verified">
                              <XCircle className="h-4 w-4 text-gray-400" />
                            </span>
                          )}
                          {user.isIdVerified ? (
                            <span title="ID verified">
                              <Shield className="h-4 w-4 text-blue-600" />
                            </span>
                          ) : (
                            <span title="ID not verified">
                              <Shield className="h-4 w-4 text-gray-400" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white">{user.totalBookings} bookings</p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {user.totalEarnings ? formatCurrency(user.totalEarnings) : formatCurrency(user.totalSpent)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(user.joinedDate)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Active: {formatDate(user.lastActive)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-[#006699] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowActionModal(true);
                            }}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
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
                  Showing {filteredUsers.length} of {users.length} users
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-[#006699] text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Modal */}
        {showActionModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  User Actions: {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left">
                    <Eye className="h-4 w-4 text-[#006699]" />
                    <span className="text-gray-900 dark:text-white">View Full Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">Send Email</span>
                  </button>
                  {selectedUser.status === 'active' ? (
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors text-left">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-900 dark:text-yellow-100">Suspend User</span>
                    </button>
                  ) : (
                    <button className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-left">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-900 dark:text-green-100">Reactivate User</span>
                    </button>
                  )}
                  <button className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-left">
                    <Ban className="h-4 w-4 text-red-600" />
                    <span className="text-red-900 dark:text-red-100">Ban User</span>
                  </button>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="secondary" onClick={() => setShowActionModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsersPage;
