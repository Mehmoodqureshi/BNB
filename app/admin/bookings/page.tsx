'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Calendar, Eye, XCircle, CheckCircle, 
  AlertTriangle, Download, MapPin, User, Home
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Button from '@/components/ui/Button';

interface Booking {
  id: string;
  bookingNumber: string;
  propertyName: string;
  propertyLocation: string;
  guestName: string;
  guestEmail: string;
  hostName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'in_progress';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'partially_refunded';
  createdAt: string;
  flags?: string[];
}

const AdminBookingsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: 'book_1',
      bookingNumber: 'BNB-2024-001',
      propertyName: 'Luxury Dubai Marina Apartment',
      propertyLocation: 'Dubai Marina, Dubai',
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@email.com',
      hostName: 'Mohammed Al-Zahra',
      checkIn: '2024-12-15',
      checkOut: '2024-12-20',
      guests: 4,
      totalAmount: 85000,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      flags: [],
    },
    {
      id: 'book_2',
      bookingNumber: 'BNB-2024-002',
      propertyName: 'Palm Jumeirah Villa',
      propertyLocation: 'Palm Jumeirah, Dubai',
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      hostName: 'Fatima Ahmed',
      checkIn: '2024-11-10',
      checkOut: '2024-11-15',
      guests: 6,
      totalAmount: 125000,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      flags: [],
    },
    {
      id: 'book_3',
      bookingNumber: 'BNB-2024-003',
      propertyName: 'Downtown Studio',
      propertyLocation: 'Downtown Dubai',
      guestName: 'Emily Chen',
      guestEmail: 'emily.chen@email.com',
      hostName: 'Ahmed Hassan',
      checkIn: '2024-10-20',
      checkOut: '2024-10-22',
      guests: 2,
      totalAmount: 15000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      flags: ['late_cancellation'],
    },
  ]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchQuery === '' || 
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getPaymentBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      refunded: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      partially_refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 100).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Bookings Management" 
          subtitle="Monitor and manage all platform bookings"
          actions={
            <Button variant="primary" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Bookings</span>
            </Button>
          }
        />

        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,234</p>
                  <p className="text-xs text-green-600 mt-1">+12% this month</p>
                </div>
                <Calendar className="h-10 w-10 text-[#006699]" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Now</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">89</p>
                  <p className="text-xs text-blue-600 mt-1">In progress</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">23</p>
                  <p className="text-xs text-red-600 mt-1">This month</p>
                </div>
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">AED 234k</p>
                  <p className="text-xs text-green-600 mt-1">+8% this month</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by booking number, guest, or property..."
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
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{booking.bookingNumber}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <Home className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{booking.propertyName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{booking.propertyLocation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-2">
                          <User className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{booking.guestName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{booking.guests} guests</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white">{formatDate(booking.checkIn)}</p>
                          <p className="text-gray-500 dark:text-gray-400">to {formatDate(booking.checkOut)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                          <br />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentBadge(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedBooking(booking);
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
                  Showing {filteredBookings.length} of {bookings.length} bookings
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

        {/* Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Booking Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedBooking.bookingNumber}
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Property</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{selectedBooking.propertyName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedBooking.propertyLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Guest</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{selectedBooking.guestName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedBooking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Host</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{selectedBooking.hostName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Guests</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{selectedBooking.guests} guests</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Check-in</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Check-out</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg mt-1">{formatCurrency(selectedBooking.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getPaymentBadge(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Contact Guest
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBookingsPage;
