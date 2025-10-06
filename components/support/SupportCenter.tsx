'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Plus, Filter, Phone, Mail, 
  AlertTriangle, CheckCircle, Clock, User, FileText,
  HelpCircle, BookOpen, Headphones, Shield, CreditCard
} from 'lucide-react';
import { SupportTicket, SupportCategory, TicketStatus, SupportPriority } from '@/lib/types/support';
import SupportTicketCard from './SupportTicketCard';
import ComplaintForm from './ComplaintForm';
import Button from '../ui/Button';

interface SupportCenterProps {
  userId: string;
  userEmail: string;
}

const SupportCenter: React.FC<SupportCenterProps> = ({ userId, userEmail }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<SupportCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<SupportPriority | 'all'>('all');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Mock data for tickets
  const mockTickets: SupportTicket[] = [
    {
      id: 'ticket-1',
      ticketNumber: 'TKT-2024-001',
      title: 'Property not as described - cleanliness issues',
      description: 'The property I booked had several cleanliness issues that were not mentioned in the listing. The bathroom had mold, and the kitchen was not properly cleaned. I would like to request a partial refund.',
      category: 'property_complaint',
      priority: 'high',
      status: 'in_progress',
      userId: userId,
      userEmail: userEmail,
      assignedTo: 'agent-1',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      messages: [
        {
          id: 'msg-1',
          ticketId: 'ticket-1',
          senderId: userId,
          senderName: 'You',
          senderType: 'user',
          content: 'The property I booked had several cleanliness issues that were not mentioned in the listing. The bathroom had mold, and the kitchen was not properly cleaned.',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'msg-2',
          ticketId: 'ticket-1',
          senderId: 'agent-1',
          senderName: 'Sarah Johnson',
          senderType: 'agent',
          content: 'Thank you for bringing this to our attention. I have contacted the host and they are sending a cleaning team immediately. We will also process a partial refund for the inconvenience.',
          createdAt: '2024-01-15T15:45:00Z'
        }
      ]
    },
    {
      id: 'ticket-2',
      ticketNumber: 'TKT-2024-002',
      title: 'Payment charged twice for same booking',
      description: 'I was charged twice for the same booking. I can see two identical transactions on my credit card statement. Please refund the duplicate charge.',
      category: 'payment_problem',
      priority: 'urgent',
      status: 'resolved',
      userId: userId,
      userEmail: userEmail,
      assignedTo: 'agent-2',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-11T11:30:00Z',
      resolvedAt: '2024-01-11T11:30:00Z',
      messages: [
        {
          id: 'msg-3',
          ticketId: 'ticket-2',
          senderId: userId,
          senderName: 'You',
          senderType: 'user',
          content: 'I was charged twice for the same booking. I can see two identical transactions on my credit card statement.',
          createdAt: '2024-01-10T09:15:00Z'
        },
        {
          id: 'msg-4',
          ticketId: 'ticket-2',
          senderId: 'agent-2',
          senderName: 'Michael Chen',
          senderType: 'agent',
          content: 'I apologize for this error. I have processed the refund for the duplicate charge. You should see the refund in your account within 3-5 business days.',
          createdAt: '2024-01-11T11:30:00Z'
        }
      ]
    },
    {
      id: 'ticket-3',
      ticketNumber: 'TKT-2024-003',
      title: 'Host cancelled my booking last minute',
      description: 'My host cancelled my booking just 2 days before my trip. This has caused significant inconvenience as I need to find alternative accommodation. What are my options?',
      category: 'booking_issue',
      priority: 'high',
      status: 'waiting_for_user',
      userId: userId,
      userEmail: userEmail,
      assignedTo: 'agent-1',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-13T09:20:00Z',
      messages: [
        {
          id: 'msg-5',
          ticketId: 'ticket-3',
          senderId: userId,
          senderName: 'You',
          senderType: 'user',
          content: 'My host cancelled my booking just 2 days before my trip. This has caused significant inconvenience.',
          createdAt: '2024-01-12T16:45:00Z'
        },
        {
          id: 'msg-6',
          ticketId: 'ticket-3',
          senderId: 'agent-1',
          senderName: 'Sarah Johnson',
          senderType: 'agent',
          content: 'I understand your frustration. We have a few options for you: 1) Full refund, 2) Help finding similar properties, or 3) Partial compensation for the inconvenience. Which option would you prefer?',
          createdAt: '2024-01-13T09:20:00Z'
        }
      ]
    },
    {
      id: 'ticket-4',
      ticketNumber: 'TKT-2024-004',
      title: 'Cannot access my account',
      description: 'I am unable to log into my account. I keep getting an error message saying "Invalid credentials" even though I am sure my password is correct. Can you help me reset it?',
      category: 'account_issue',
      priority: 'medium',
      status: 'open',
      userId: userId,
      userEmail: userEmail,
      createdAt: '2024-01-14T08:30:00Z',
      updatedAt: '2024-01-14T08:30:00Z',
      messages: [
        {
          id: 'msg-7',
          ticketId: 'ticket-4',
          senderId: userId,
          senderName: 'You',
          senderType: 'user',
          content: 'I am unable to log into my account. I keep getting an error message saying "Invalid credentials" even though I am sure my password is correct.',
          createdAt: '2024-01-14T08:30:00Z'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = tickets;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  const handleSubmitComplaint = async (data: any) => {
    // Simulate API call
    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'open',
      userId: userId,
      userEmail: userEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };

    setTickets(prev => [newTicket, ...prev]);
    setShowComplaintForm(false);
  };

  const handleViewDetails = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      // In a real app, you might navigate to a detailed view or open a modal
      console.log('View ticket details:', ticket);
    }
  };

  const handleReply = (ticketId: string) => {
    console.log('Reply to ticket:', ticketId);
    // In a real app, you might open a reply modal or navigate to a conversation view
  };

  const getStatusCounts = () => {
    return {
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      total: tickets.length
    };
  };

  const statusCounts = getStatusCounts();

  if (showComplaintForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ComplaintForm
            onSubmit={handleSubmitComplaint}
            onCancel={() => setShowComplaintForm(false)}
            isLoading={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Customer Support
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Get help with your bookings, payments, and account issues
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowComplaintForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Ticket</span>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Call Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">+971 4 123 4567</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@bnb.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <HelpCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Help Center</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Browse FAQs</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Headphones className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
                <p className="text-2xl font-bold text-orange-600">{statusCounts.open}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.resolved}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_for_user">Waiting for User</option>
                <option value="waiting_for_agent">Waiting for Agent</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="escalated">Escalated</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as SupportCategory | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="booking_issue">Booking Issue</option>
                <option value="payment_problem">Payment Problem</option>
                <option value="property_complaint">Property Complaint</option>
                <option value="host_issue">Host Issue</option>
                <option value="cancellation">Cancellation</option>
                <option value="refund_request">Refund Request</option>
                <option value="technical_support">Technical Support</option>
                <option value="account_issue">Account Issue</option>
                <option value="safety_concern">Safety Concern</option>
                <option value="other">Other</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as SupportPriority | 'all')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#006699] border-t-transparent"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No tickets found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'You haven\'t submitted any support tickets yet.'
                }
              </p>
              {(!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && priorityFilter === 'all') && (
                <Button
                  variant="primary"
                  onClick={() => setShowComplaintForm(true)}
                  className="flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Submit Your First Ticket</span>
                </Button>
              )}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <SupportTicketCard
                key={ticket.id}
                ticket={ticket}
                onViewDetails={handleViewDetails}
                onReply={handleReply}
                showActions={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
