'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  Heart, MapPin, Star, Search, Filter, Grid3X3, List,
  ChevronLeft, Eye, Calendar, Users, Bath, Bed
} from 'lucide-react';

const WishlistPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/test-auth');
    return null;
  }

  // Mock wishlist data
  const wishlistItems = [
    {
      id: '1',
      property: {
        title: 'Luxury Apartment in Downtown Dubai',
        location: 'Downtown Dubai, Dubai',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        rating: 4.8,
        reviewCount: 124,
        price: 450,
        currency: 'AED',
        type: 'Apartment',
        beds: 2,
        baths: 2,
        guests: 4,
        amenities: ['Wifi', 'Pool', 'Gym', 'Concierge']
      },
      addedDate: '2024-01-15',
      notes: 'Perfect for weekend getaway'
    },
    {
      id: '2',
      property: {
        title: 'Beachfront Villa in Palm Jumeirah',
        location: 'Palm Jumeirah, Dubai',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        rating: 4.9,
        reviewCount: 89,
        price: 1200,
        currency: 'AED',
        type: 'Villa',
        beds: 4,
        baths: 3,
        guests: 8,
        amenities: ['Private Beach', 'Pool', 'BBQ Area', 'Garden']
      },
      addedDate: '2024-01-10',
      notes: 'Family vacation spot'
    },
    {
      id: '3',
      property: {
        title: 'Modern Penthouse in Marina',
        location: 'Dubai Marina, Dubai',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
        rating: 4.7,
        reviewCount: 156,
        price: 800,
        currency: 'AED',
        type: 'Penthouse',
        beds: 3,
        baths: 3,
        guests: 6,
        amenities: ['Marina View', 'Balcony', 'Gym', 'Pool']
      },
      addedDate: '2024-01-05',
      notes: 'Amazing views'
    }
  ];

  const filteredItems = wishlistItems.filter(item =>
    item.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFromWishlist = (id: string) => {
    // In a real app, this would call an API
    console.log('Remove from wishlist:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-2 fill-current" />
                  My Wishlist
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{wishlistItems.length} saved properties</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Toggle */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Saved Properties ({filteredItems.length})
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#006699] text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#006699] text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {filteredItems.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 dark:border-gray-700/50 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No matching properties' : 'Your wishlist is empty'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? "Try adjusting your search terms."
                : "Start saving properties you love to see them here."
              }
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
            >
              {searchQuery ? 'Clear Search' : 'Start Exploring'}
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {filteredItems.map((item) => (
              <div key={item.id} className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}>
                {/* Property Image */}
                <div className={viewMode === 'list' ? 'w-80' : 'w-full'}>
                  <img
                    src={item.property.image}
                    alt={item.property.title}
                    className={`object-cover ${viewMode === 'list' ? 'h-48 w-full' : 'h-48 w-full'}`}
                  />
                </div>

                {/* Property Details */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{item.property.location}</span>
                      </div>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">{item.property.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({item.property.reviewCount})</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Added {new Date(item.addedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  {/* Property Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{item.property.beds} beds</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{item.property.baths} baths</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{item.property.guests} guests</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.property.price} {item.property.currency}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors">
                        <Calendar className="h-4 w-4" />
                        <span>Book Now</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Note:</strong> {item.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
