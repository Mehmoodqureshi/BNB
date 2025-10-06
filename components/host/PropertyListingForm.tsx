'use client';

import React, { useState } from 'react';
import { 
  Home, MapPin, Users, Bed, Bath, Car, Wifi, 
  Shield, Coffee, Waves, Camera, Plus, X, 
  Save, Eye, AlertCircle, CheckCircle, DollarSign, Map, Navigation
} from 'lucide-react';
import { PropertyListing, PropertyAmenity, PropertyPhoto } from '@/lib/types/host';
import Button from '../ui/Button';
import LocationPicker from './LocationPicker';

interface PropertyListingFormProps {
  onSubmit: (property: PropertyListing) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PropertyListing>;
  isLoading?: boolean;
}

const PropertyListingForm: React.FC<PropertyListingFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [step, setStep] = useState<'basic' | 'location' | 'capacity' | 'amenities' | 'houseRules' | 'pricing' | 'review'>('basic');
  const [formData, setFormData] = useState<Partial<PropertyListing>>({
    title: '',
    description: '',
    type: 'apartment',
    propertyType: 'entire_place',
    capacity: {
      guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1
    },
    location: {
      address: '',
      emirate: 'Dubai',
      country: 'UAE',
      lat: 0,
      lng: 0
    },
    amenities: [],
    houseRules: [],
    pricing: {
      basePrice: 0,
      currency: 'AED',
      cleaningFee: 0,
      serviceFee: 0,
      securityDeposit: 0
    },
    availability: {
      minimumStay: 1,
      advanceBookingLimit: 365,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      instantBook: false
    },
    photos: [],
    ...initialData
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newHouseRule, setNewHouseRule] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Home },
    { value: 'house', label: 'House', icon: Home },
    { value: 'villa', label: 'Villa', icon: Home },
    { value: 'condo', label: 'Condo', icon: Home },
    { value: 'studio', label: 'Studio', icon: Home },
    { value: 'penthouse', label: 'Penthouse', icon: Home },
    { value: 'townhouse', label: 'Townhouse', icon: Home }
  ];

  const propertyCategories = [
    { value: 'entire_place', label: 'Entire place', description: 'Guests have the whole place to themselves' },
    { value: 'private_room', label: 'Private room', description: 'Guests have their own room in a home, plus access to shared spaces' },
    { value: 'shared_room', label: 'Shared room', description: 'Guests sleep in a room or common area that may be shared with you or others' }
  ];

  const amenities: PropertyAmenity[] = [
    { id: 'wifi', name: 'WiFi', category: 'basic', icon: 'wifi', isIncluded: false },
    { id: 'kitchen', name: 'Kitchen', category: 'kitchen', icon: 'kitchen', isIncluded: false },
    { id: 'parking', name: 'Free parking', category: 'parking', icon: 'parking', isIncluded: false },
    { id: 'pool', name: 'Pool', category: 'outdoor', icon: 'pool', isIncluded: false },
    { id: 'gym', name: 'Gym', category: 'entertainment', icon: 'gym', isIncluded: false },
    { id: 'washer', name: 'Washer', category: 'bathroom', icon: 'washer', isIncluded: false },
    { id: 'dryer', name: 'Dryer', category: 'bathroom', icon: 'dryer', isIncluded: false },
    { id: 'ac', name: 'Air conditioning', category: 'basic', icon: 'ac', isIncluded: false },
    { id: 'heating', name: 'Heating', category: 'basic', icon: 'heating', isIncluded: false },
    { id: 'tv', name: 'TV', category: 'entertainment', icon: 'tv', isIncluded: false },
    { id: 'workspace', name: 'Laptop friendly workspace', category: 'basic', icon: 'workspace', isIncluded: false },
    { id: 'hot_tub', name: 'Hot tub', category: 'outdoor', icon: 'hot_tub', isIncluded: false },
    { id: 'balcony', name: 'Balcony', category: 'outdoor', icon: 'balcony', isIncluded: false },
    { id: 'garden', name: 'Garden', category: 'outdoor', icon: 'garden', isIncluded: false },
    { id: 'beach_access', name: 'Beach access', category: 'location', icon: 'beach', isIncluded: false },
    { id: 'elevator', name: 'Elevator', category: 'basic', icon: 'elevator', isIncluded: false },
    { id: 'fireplace', name: 'Fireplace', category: 'basic', icon: 'fireplace', isIncluded: false },
    { id: 'smoke_alarm', name: 'Smoke alarm', category: 'safety', icon: 'smoke_alarm', isIncluded: false },
    { id: 'carbon_monoxide_alarm', name: 'Carbon monoxide alarm', category: 'safety', icon: 'carbon_monoxide', isIncluded: false },
    { id: 'first_aid_kit', name: 'First aid kit', category: 'safety', icon: 'first_aid', isIncluded: false }
  ];

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof PropertyListing] as any || {}),
        [field]: value
      }
    }));
  };

  const addHouseRule = () => {
    if (newHouseRule.trim()) {
      setFormData(prev => ({
        ...prev,
        houseRules: [...(prev.houseRules || []), newHouseRule.trim()]
      }));
      setNewHouseRule('');
    }
  };

  const removeHouseRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules?.filter((_, i) => i !== index) || []
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    const amenity = amenities.find(a => a.id === amenityId);
    if (!amenity) return;

    const isSelected = selectedAmenities.includes(amenityId);
    let newAmenities: PropertyAmenity[];

    if (isSelected) {
      newAmenities = formData.amenities?.filter(a => a.id !== amenityId) || [];
      setSelectedAmenities(prev => prev.filter(id => id !== amenityId));
    } else {
      newAmenities = [...(formData.amenities || []), { ...amenity, isIncluded: true }];
      setSelectedAmenities(prev => [...prev, amenityId]);
    }

    setFormData(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  const validateStep = (stepName: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepName) {
      case 'basic':
        if (!formData.title?.trim()) newErrors.title = 'Title is required';
        if (!formData.description?.trim()) newErrors.description = 'Description is required';
        if (formData.description && formData.description.length < 50) {
          newErrors.description = 'Description must be at least 50 characters';
        }
        break;
      case 'location':
        if (!formData.location?.address?.trim()) newErrors.address = 'Property location is required';
        if (!formData.location?.emirate) newErrors.emirate = 'Emirate is required';
        break;
      case 'capacity':
        // Capacity step doesn't require validation - all fields have defaults
        break;
      case 'amenities':
        // Amenities step doesn't require validation - amenities are optional
        break;
      case 'houseRules':
        // House rules step doesn't require validation - rules are optional
        break;
      case 'pricing':
        if (!formData.pricing?.basePrice || formData.pricing.basePrice <= 0) {
          newErrors.basePrice = 'Base price is required and must be greater than 0';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    const steps = ['basic', 'location', 'capacity', 'amenities', 'houseRules', 'pricing', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as any);
    }
  };

  const handlePrevious = () => {
    const steps = ['basic', 'location', 'capacity', 'amenities', 'houseRules', 'pricing', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as any);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    const propertyData: PropertyListing = {
      id: `property-${Date.now()}`,
      hostId: 'current-host-id',
      title: formData.title!,
      description: formData.description!,
      type: formData.type!,
      propertyType: formData.propertyType!,
      location: formData.location!,
      capacity: formData.capacity!,
      amenities: formData.amenities!,
      houseRules: formData.houseRules!,
      pricing: formData.pricing!,
      availability: formData.availability!,
      photos: formData.photos!,
      status: 'draft',
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await onSubmit(propertyData);
  };

  const renderBasicStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Home className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Tell us about your place
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start with the basics about your property
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Luxury Apartment in Downtown Dubai"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('type', type.value)}
                className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                  formData.type === type.value
                    ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <type.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 mb-2" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {type.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Category *
          </label>
          <div className="space-y-3">
            {propertyCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleInputChange('propertyType', category.value)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  formData.propertyType === category.value
                    ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {category.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            placeholder="Describe your property in detail. What makes it special? What can guests expect?"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {(formData.description || '').length}/500 characters
          </p>
        </div>
      </div>
    </div>
  );

  const renderLocationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Where's your place located?
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Help guests find your property
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Location *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.location?.address || ''}
              onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
              placeholder="Select location on map or enter address"
              className={`w-full px-3 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.address ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              readOnly
            />
            <button
              type="button"
              onClick={() => setShowMapPopup(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-[#006699] transition-colors"
              title="Select location on map"
            >
              <Navigation className="h-5 w-5" />
            </button>
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Click the map icon to select your property location
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Emirate *
          </label>
          <select
            value={formData.location?.emirate || ''}
            onChange={(e) => handleNestedInputChange('location', 'emirate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
              errors.emirate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select Emirate</option>
            {emirates.map((emirate) => (
              <option key={emirate} value={emirate}>{emirate}</option>
            ))}
          </select>
          {errors.emirate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.emirate}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCapacityStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          How many guests can your place accommodate?
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Set capacity and room details
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Guests
          </label>
          <input
            type="number"
            min="1"
            max="16"
            value={formData.capacity?.guests || 1}
            onChange={(e) => handleNestedInputChange('capacity', 'guests', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bedrooms
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={formData.capacity?.bedrooms || 1}
            onChange={(e) => handleNestedInputChange('capacity', 'bedrooms', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bathrooms
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={formData.capacity?.bathrooms || 1}
            onChange={(e) => handleNestedInputChange('capacity', 'bathrooms', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Beds
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.capacity?.beds || 1}
            onChange={(e) => handleNestedInputChange('capacity', 'beds', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderAmenitiesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          What amenities do you offer?
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select all amenities available at your property
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {amenities.map((amenity) => (
          <button
            key={amenity.id}
            type="button"
            onClick={() => toggleAmenity(amenity.id)}
            className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
              selectedAmenities.includes(amenity.id)
                ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {amenity.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPricingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Set your pricing
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          How much do you want to charge per night?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Base Price per Night (AED) *
          </label>
          <input
            type="number"
            min="0"
            step="10"
            value={formData.pricing?.basePrice || 0}
            onChange={(e) => handleNestedInputChange('pricing', 'basePrice', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
              errors.basePrice ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.basePrice && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.basePrice}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cleaning Fee (AED)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={formData.pricing?.cleaningFee || 0}
              onChange={(e) => handleNestedInputChange('pricing', 'cleaningFee', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Deposit (AED)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={formData.pricing?.securityDeposit || 0}
              onChange={(e) => handleNestedInputChange('pricing', 'securityDeposit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Stay (nights)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.availability?.minimumStay || 1}
              onChange={(e) => handleNestedInputChange('availability', 'minimumStay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="instantBook"
              checked={formData.availability?.instantBook || false}
              onChange={(e) => handleNestedInputChange('availability', 'instantBook', e.target.checked)}
              className="h-4 w-4 text-[#006699] focus:ring-[#006699] border-gray-300 rounded"
            />
            <label htmlFor="instantBook" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Enable instant booking
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHouseRulesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          House Rules
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Set rules for your guests
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add House Rule
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newHouseRule}
              onChange={(e) => setNewHouseRule(e.target.value)}
              placeholder="e.g., No smoking, No pets, No parties"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addHouseRule}
              disabled={!newHouseRule.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {formData.houseRules?.map((rule, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-white">{rule}</span>
              <button
                type="button"
                onClick={() => removeHouseRule(index)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Review Your Listing
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Make sure everything looks good before publishing
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Property Details</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Title:</strong> {formData.title}</p>
            <p><strong>Type:</strong> {formData.type} • {formData.propertyType}</p>
            <p><strong>Capacity:</strong> {formData.capacity?.guests} guests, {formData.capacity?.bedrooms} bedrooms, {formData.capacity?.bathrooms} bathrooms</p>
            <p><strong>Location:</strong> {formData.location?.address}, {formData.location?.city}, {formData.location?.emirate}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Pricing</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Base Price:</strong> AED {formData.pricing?.basePrice} per night</p>
            <p><strong>Cleaning Fee:</strong> AED {formData.pricing?.cleaningFee || 0}</p>
            <p><strong>Security Deposit:</strong> AED {formData.pricing?.securityDeposit || 0}</p>
            <p><strong>Minimum Stay:</strong> {formData.availability?.minimumStay} nights</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Amenities ({selectedAmenities.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedAmenities.map((amenityId) => {
              const amenity = amenities.find(a => a.id === amenityId);
              return (
                <span key={amenityId} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                  {amenity?.name}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">House Rules ({formData.houseRules?.length || 0})</h4>
          <div className="space-y-1">
            {formData.houseRules?.map((rule, index) => (
              <p key={index} className="text-sm text-gray-600 dark:text-gray-400">• {rule}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'basic':
        return renderBasicStep();
      case 'location':
        return renderLocationStep();
      case 'capacity':
        return renderCapacityStep();
      case 'amenities':
        return renderAmenitiesStep();
      case 'houseRules':
        return renderHouseRulesStep();
      case 'pricing':
        return renderPricingStep();
      case 'review':
        return renderReviewStep();
      default:
        return renderBasicStep();
    }
  };

  const steps = [
    { id: 'basic', name: 'Basic Info', icon: Home },
    { id: 'location', name: 'Location', icon: MapPin },
    { id: 'capacity', name: 'Capacity', icon: Users },
    { id: 'amenities', name: 'Amenities', icon: Shield },
    { id: 'houseRules', name: 'House Rules', icon: Shield },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'review', name: 'Review', icon: Eye }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Create New Property Listing
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Add your property to start hosting guests
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4">
          {steps.map((stepItem, index) => (
            <div key={stepItem.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === stepItem.id
                  ? 'bg-[#006699] text-white'
                  : index < steps.indexOf(steps.find(s => s.id === step)!)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <stepItem.icon className="h-4 w-4" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step === stepItem.id ? 'text-[#006699]' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {stepItem.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-4 ${
                  index < steps.indexOf(steps.find(s => s.id === step)!)
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6">
          <div>
            {step !== 'basic' && (
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                Previous
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {step === 'review' ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Listing</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Map Popup */}
      {showMapPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMapPopup(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Property Location
                </h3>
                <button
                  onClick={() => setShowMapPopup(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Click anywhere on the map to automatically select your property location
              </p>
            </div>
            
            <div className="p-4 h-full">
              {/* Real Google Maps */}
              <div className="relative w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <LocationPicker
                  onLocationSelect={(location) => {
                    setSelectedLocation(location);
                    handleNestedInputChange('location', 'address', location.address);
                    handleNestedInputChange('location', 'lat', location.lat);
                    handleNestedInputChange('location', 'lng', location.lng);
                    setShowMapPopup(false);
                  }}
                  initialCenter={{ lat: 25.1932, lng: 55.4144 }}
                  initialZoom={12}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListingForm;
