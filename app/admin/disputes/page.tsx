'use client';

import React, { useState } from 'react';
import { 
  Search, AlertTriangle, MessageSquare, Eye, CheckCircle,
  XCircle, Clock, FileText
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';

interface Dispute {
  id: string;
  disputeId: string;
  type: 'refund_request' | 'property_issue' | 'guest_complaint' | 'host_complaint' | 'payment_issue';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  bookingId: string;
  reporter: string;
  reporterType: 'guest' | 'host';
  subject: string;
  description: string;
  createdAt: string;
  lastUpdate: string;
  assignedTo?: string;
}

const AdminDisputesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock disputes data
  const [disputes] = useState<Dispute[]>([
    {
      id: 'disp_1',
      disputeId: 'DISP-2024-001',
      type: 'refund_request',
      status: 'open',
      priority: 'high',
      bookingId: 'BNB-2024-045',
      reporter: 'Sarah Johnson',
      reporterType: 'guest',
      subject: 'Property not as described',
      description: 'The property description mentioned ocean view but the view was blocked by buildings.',
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      assignedTo: 'Admin Team',
    },
    {
      id: 'disp_2',
      disputeId: 'DISP-2024-002',
      type: 'guest_complaint',
      status: 'investigating',
      priority: 'medium',
      bookingId: 'BNB-2024-043',
      reporter: 'Mohammed Al-Zahra',
      reporterType: 'host',
      subject: 'Guest caused property damage',
      description: 'Guest damaged furniture and left the property in poor condition.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'John Admin',
    },
    {
      id: 'disp_3',
      disputeId: 'DISP-2024-003',
      type: 'payment_issue',
      status: 'resolved',
      priority: 'urgent',
      bookingId: 'BNB-2024-041',
      reporter: 'Emily Chen',
      reporterType: 'guest',
      subject: 'Charged incorrect amount',
      description: 'I was charged more than the agreed booking price.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Sarah Admin',
    },
  ]);

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = searchQuery === '' || 
      dispute.disputeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      investigating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return styles[status as keyof typeof styles] || styles.open;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return styles[priority as keyof typeof styles] || styles.medium;
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

  const openDisputes = disputes.filter(d => d.status === 'open').length;
  const investigatingDisputes = disputes.filter(d => d.status === 'investigating').length;
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved').length;
  const urgentDisputes = disputes.filter(d => d.priority === 'urgent').length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Disputes & Reports" 
          subtitle="Manage platform disputes and user complaints"
        />

        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-md border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">Open Disputes</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-white mt-1">{openDisputes}</p>
                  <p className="text-xs text-red-600 mt-1">Requires attention</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 shadow-md border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Investigating</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-white mt-1">{investigatingDisputes}</p>
                  <p className="text-xs text-yellow-600 mt-1">In progress</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-md border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-white mt-1">{resolvedDisputes}</p>
                  <p className="text-xs text-green-600 mt-1">This month</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-md border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Urgent</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-white mt-1">{urgentDisputes}</p>
                  <p className="text-xs text-purple-600 mt-1">High priority</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </div>

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
                    placeholder="Search by dispute ID, user, or subject..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Disputes Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dispute ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDisputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{dispute.disputeId}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{dispute.bookingId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{dispute.subject}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {dispute.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 dark:text-white">{dispute.reporter}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{dispute.reporterType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white capitalize">
                          {dispute.type.replace('_', ' ')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(dispute.priority)}`}>
                          {dispute.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(dispute.status)}`}>
                          {dispute.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(dispute.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setShowDetailsModal(true);
                          }}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
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
                  Showing {filteredDisputes.length} of {disputes.length} disputes
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

        {/* Details Modal */}
        {showDetailsModal && selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dispute Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedDispute.disputeId}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusBadge(selectedDispute.status)}`}>
                      {selectedDispute.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getPriorityBadge(selectedDispute.priority)}`}>
                      {selectedDispute.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reporter</p>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedDispute.reporter}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{selectedDispute.reporterType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Booking ID</p>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedDispute.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</p>
                    <p className="text-gray-900 dark:text-white mt-1 capitalize">
                      {selectedDispute.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned To</p>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedDispute.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Subject</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedDispute.subject}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</p>
                  <p className="text-gray-900 dark:text-white">{selectedDispute.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(selectedDispute.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Update</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(selectedDispute.lastUpdate)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Take Action
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDisputesPage;
