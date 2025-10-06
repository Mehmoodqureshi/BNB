'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, Eye, Edit, Trash2, MoreVertical, Calendar, 
  DollarSign, Star, Users, MapPin, Camera, 
  CheckCircle, AlertCircle, Clock, X
} from 'lucide-react';
import { PropertyListing, HostBooking } from '@/lib/types/host';
import Button from '../ui/Button';

interface PropertyManagementProps {
  hostId: string;
  onAddProperty?: () => void;
}

const PropertyManagement: React.FC<PropertyManagementProps> = ({ hostId, onAddProperty }) => {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  // Mock data - in a real app, this would come from APIs
  const mockProperties: PropertyListing[] = [
    {
      id: 'property-1',
      hostId: hostId,
      title: 'Luxury Apartment in Downtown Dubai',
      description: 'Experience the vibrant energy of downtown Dubai in this beautifully designed modern apartment.',
      type: 'apartment',
      propertyType: 'entire_place',
      location: {
        address: 'Downtown Dubai',
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'UAE',
        lat: 25.1972,
        lng: 55.2744
      },
      capacity: {
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        beds: 2
      },
      amenities: [],
      houseRules: ['No smoking', 'No pets', 'No parties'],
      pricing: {
        basePrice: 450,
        currency: 'AED',
        cleaningFee: 100,
        securityDeposit: 500
      },
      availability: {
        minimumStay: 1,
        advanceBookingLimit: 365,
        checkInTime: '15:00',
        checkOutTime: '11:00',
        instantBook: true
      },
      photos: [
        {
          id: 'photo-1',
          url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
          isPrimary: true,
          order: 1,
          uploadedAt: '2024-01-01T00:00:00Z',
          fileSize: 1024000,
          dimensions: { width: 400, height: 300 }
        }
      ],
      status: 'approved',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: 'property-2',
      hostId: hostId,
      title: 'Beachfront Villa on Palm Jumeirah',
      description: 'Stunning beachfront villa with private beach access and panoramic views.',
      type: 'villa',
      propertyType: 'entire_place',
      location: {
        address: 'Palm Jumeirah',
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'UAE',
        lat: 25.1124,
        lng: 55.1390
      },
      capacity: {
        guests: 8,
        bedrooms: 4,
        bathrooms: 4,
        beds: 4
      },
      amenities: [],
      houseRules: ['No smoking', 'No pets', 'No parties', 'No loud music after 10 PM'],
      pricing: {
        basePrice: 1200,
        currency: 'AED',
        cleaningFee: 200,
        securityDeposit: 1000
      },
      availability: {
        minimumStay: 2,
        advanceBookingLimit: 365,
        checkInTime: '15:00',
        checkOutTime: '11:00',
        instantBook: false
      },
      photos: [
        {
          id: 'photo-2',
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          isPrimary: true,
          order: 1,
          uploadedAt: '2024-01-01T00:00:00Z',
          fileSize: 1024000,
          dimensions: { width: 400, height: 300 }
        }
      ],
      status: 'approved',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: 'property-3',
      hostId: hostId,
      title: 'Modern Studio in Marina',
      description: 'Contemporary studio apartment with marina views and modern amenities.',
      type: 'studio',
      propertyType: 'entire_place',
      location: {
        address: 'Dubai Marina',
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'UAE',
        lat: 25.0772,
        lng: 55.1307
      },
      capacity: {
        guests: 2,
        bedrooms: 0,
        bathrooms: 1,
        beds: 1
      },
      amenities: [],
      houseRules: ['No smoking', 'No pets'],
      pricing: {
        basePrice: 350,
        currency: 'AED',
        cleaningFee: 50,
        securityDeposit: 300
      },
      availability: {
        minimumStay: 1,
        advanceBookingLimit: 365,
        checkInTime: '15:00',
        checkOutTime: '11:00',
        instantBook: true
      },
      photos: [
        {
          id: 'photo-3',
          url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
          isPrimary: true,
          order: 1,
          uploadedAt: '2024-01-01T00:00:00Z',
          fileSize: 1024000,
          dimensions: { width: 400, height: 300 }
        }
      ],
      status: 'pending_review',
      isActive: false,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProperties(mockProperties);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending_review':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleEditProperty = (property: PropertyListing) => {
    console.log('Edit property:', property);
    // In a real app, this would navigate to the edit form
  };

  const handleViewProperty = (property: PropertyListing) => {
    console.log('View property:', property);
    // In a real app, this would open the property preview
  };

  const handleDeleteProperty = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete));
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  const togglePropertyStatus = (propertyId: string) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId 
        ? { ...p, isActive: !p.isActive }
        : p
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
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
                Manage Properties
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage all your property listings
              </p>
            </div>
            <Button
              variant="primary"
              onClick={onAddProperty}
              className="flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Add Property</span>
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Property Image */}
              <div className="relative h-48">
                <img
                  src={property.photos[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {getStatusIcon(property.status)}
                    <span className="ml-1 capitalize">{property.status.replace('_', ' ')}</span>
                  </span>
                </div>

                {/* Active/Inactive Toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => togglePropertyStatus(property.id)}
                    className={`p-2 rounded-full ${
                      property.isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}
                    title={property.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>

                {/* Actions Menu */}
                <div className="absolute bottom-3 right-3">
                  <div className="relative">
                    <button className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location.city}, {property.location.emirate}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {property.capacity.guests}
                    </div>
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {property.capacity.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Camera className="h-4 w-4 mr-1" />
                      {property.photos.length}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      AED {property.pricing.basePrice}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      per night
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewProperty(property)}
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditProperty(property)}
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteProperty(property.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No properties yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first property to begin hosting guests.
            </p>
            <Button
              variant="primary"
              onClick={onAddProperty}
              className="flex items-center space-x-2 mx-auto"
            >
              <Home className="h-5 w-5" />
              <span>Add Your First Property</span>
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <div className="text-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-12 h-12 mx-auto mb-4">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Property
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete this property? This action cannot be undone and will cancel all future bookings.
                </p>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManagement;
