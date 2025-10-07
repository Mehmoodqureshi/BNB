'use client';

import React, { useState } from 'react';
import { 
  Search, CheckCircle, XCircle, Eye, AlertTriangle, 
  Home, MapPin, DollarSign, Star, Flag
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { PropertyManagementRecord } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

const AdminPropertiesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('pending_approval');
  const [selectedProperty, setSelectedProperty] = useState<PropertyManagementRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock properties data
  const [properties, setProperties] = useState<PropertyManagementRecord[]>([
    {
      id: 'prop_1',
      title: 'Luxury Penthouse in Marina',
      hostId: 'host_1',
      hostName: 'Ahmed Al-Rashid',
      status: 'pending_approval',
      location: 'Dubai Marina, Dubai',
      type: 'Penthouse',
      pricePerNight: 120000, // AED 1,200
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      reviewCount: 0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      flags: [],
    },
    {
      id: 'prop_2',
      title: 'Beachfront Villa with Pool',
      hostId: 'host_2',
      hostName: 'Sarah Johnson',
      status: 'pending_approval',
      location: 'Palm Jumeirah, Dubai',
      type: 'Villa',
      pricePerNight: 250000, // AED 2,500
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      reviewCount: 0,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      flags: [
        {
          type: 'pricing_issue',
          severity: 'low',
          description: 'Price seems high for area',
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'prop_3',
      title: 'Modern Apartment Downtown',
      hostId: 'host_3',
      hostName: 'Mohammed Al-Zahra',
      status: 'approved',
      location: 'Downtown Dubai, Dubai',
      type: 'Apartment',
      pricePerNight: 45000, // AED 450
      totalBookings: 45,
      totalRevenue: 202500000, // AED 2.025M
      averageRating: 4.8,
      reviewCount: 34,
      createdAt: '2024-01-15',
      lastModified: '2024-09-20',
      flags: [],
    },
  ]);

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = searchQuery === '' || 
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (propertyId: string) => {
    setProperties(prev => 
      prev.map(p => p.id === propertyId ? { ...p, status: 'approved' as const } : p)
    );
    setShowDetailsModal(false);
    alert('Property approved successfully!');
  };

  const handleReject = (propertyId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    setProperties(prev => 
      prev.map(p => p.id === propertyId 
        ? { ...p, status: 'rejected' as const, rejectionReason } 
        : p
      )
    );
    setShowDetailsModal(false);
    setRejectionReason('');
    alert('Property rejected. Host will be notified.');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return styles[status as keyof typeof styles] || styles.pending_approval;
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
          title="Property Management" 
          subtitle="Review and approve property listings"
        />

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {properties.filter(p => p.status === 'pending_approval').length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {properties.filter(p => p.status === 'approved').length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {properties.filter(p => p.status === 'rejected').length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {properties.filter(p => p.flags.length > 0).length}
              </p>
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
                    placeholder="Search properties..."
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
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{property.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(property.status)}`}>
                      {property.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatCurrency(property.pricePerNight)} / night
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                      {property.averageRating > 0 ? `${property.averageRating} (${property.reviewCount})` : 'No reviews'}
                    </div>
                  </div>

                  {property.flags.length > 0 && (
                    <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100">
                            {property.flags.length} Flag{property.flags.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300">
                            {property.flags[0].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    by {property.hostName} • {formatDate(property.createdAt)}
                  </p>

                  {property.status === 'pending_approval' ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(property.id)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowDetailsModal(true);
                      }}
                      className="w-full flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No properties found matching your filters</p>
            </div>
          )}
        </div>

        {/* Property Details/Rejection Modal */}
        {showDetailsModal && selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] p-6 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Property Details</h3>
                  <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{selectedProperty.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProperty.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProperty.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Price/Night</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(selectedProperty.pricePerNight)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Host</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedProperty.hostName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedProperty.status)}`}>
                      {selectedProperty.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {selectedProperty.flags.length > 0 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Flags</h5>
                    {selectedProperty.flags.map((flag, index) => (
                      <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                        • {flag.description} ({flag.severity} severity)
                      </div>
                    ))}
                  </div>
                )}

                {selectedProperty.status === 'pending_approval' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why this property is being rejected..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedProperty.status === 'pending_approval' && (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(selectedProperty.id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve Property</span>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleReject(selectedProperty.id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </Button>
                    </>
                  )}
                  {selectedProperty.status !== 'pending_approval' && (
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)} className="flex-1">
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPropertiesPage;
