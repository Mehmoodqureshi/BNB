'use client';

import React, { useState, useRef } from 'react';
import { 
  Home, MapPin, Users, Bed, Bath, Car, Wifi, 
  Shield, Coffee, Waves, Camera, Plus, X, 
  Save, Eye, AlertCircle, CheckCircle, DollarSign, Map, Navigation,
  Upload, Image as ImageIcon, Trash2, Star, MoveUp, MoveDown
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
  const [step, setStep] = useState<'basic' | 'location' | 'capacity' | 'amenities' | 'photos' | 'houseRules' | 'pricing' | 'review'>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<PropertyPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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
      city: '',
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
      case 'photos':
        if (uploadedPhotos.length < 5) {
          newErrors.photos = 'You must upload at least 5 photos of your property';
        }
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

    const steps = ['basic', 'location', 'capacity', 'amenities', 'photos', 'houseRules', 'pricing', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as any);
    }
  };

  const handlePrevious = () => {
    const steps = ['basic', 'location', 'capacity', 'amenities', 'photos', 'houseRules', 'pricing', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as any);
    }
  };

  // Photo upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    handleFiles(Array.from(files));
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: PropertyPhoto = {
          id: `photo-${Date.now()}-${Math.random()}`,
          url: e.target?.result as string,
          isPrimary: uploadedPhotos.length === 0, // First photo is primary
          order: uploadedPhotos.length + 1,
          uploadedAt: new Date().toISOString(),
          fileSize: file.size,
          dimensions: { width: 0, height: 0 } // Will be calculated if needed
        };
        
        setUploadedPhotos(prev => [...prev, newPhoto]);
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), newPhoto]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleRemovePhoto = (photoId: string) => {
    const updatedPhotos = uploadedPhotos.filter(p => p.id !== photoId);
    // Re-assign order
    const reorderedPhotos = updatedPhotos.map((photo, index) => ({
      ...photo,
      order: index + 1,
      isPrimary: index === 0 // First photo becomes primary
    }));
    
    setUploadedPhotos(reorderedPhotos);
    setFormData(prev => ({
      ...prev,
      photos: reorderedPhotos
    }));
  };

  const handleSetPrimaryPhoto = (photoId: string) => {
    const updatedPhotos = uploadedPhotos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    }));
    
    setUploadedPhotos(updatedPhotos);
    setFormData(prev => ({
      ...prev,
      photos: updatedPhotos
    }));
  };

  const handleMovePhoto = (photoId: string, direction: 'up' | 'down') => {
    const currentIndex = uploadedPhotos.findIndex(p => p.id === photoId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= uploadedPhotos.length) return;
    
    const newPhotos = [...uploadedPhotos];
    [newPhotos[currentIndex], newPhotos[newIndex]] = [newPhotos[newIndex], newPhotos[currentIndex]];
    
    // Update order
    const reorderedPhotos = newPhotos.map((photo, index) => ({
      ...photo,
      order: index + 1
    }));
    
    setUploadedPhotos(reorderedPhotos);
    setFormData(prev => ({
      ...prev,
      photos: reorderedPhotos
    }));
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
      photos: uploadedPhotos,
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

        {/* Coordinates Display */}
        {formData.location?.lat !== 0 && formData.location?.lng !== 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-1.5" />
                  Location Coordinates
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Latitude</p>
                    <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                      {formData.location?.lat.toFixed(6)}°
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Longitude</p>
                    <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                      {formData.location?.lng.toFixed(6)}°
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <Navigation className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Precise location set for property mapping
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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

  const renderPhotosStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Upload Photos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add at least 5 high-quality photos of your property
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          First photo will be your cover image
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10 scale-105' 
            : 'border-gray-300 dark:border-gray-600 hover:border-[#006699] dark:hover:border-[#006699] hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Upload className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Drag and drop photos here
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              or click to browse from your computer
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-1" />
              JPG, PNG, WebP
            </span>
            <span>•</span>
            <span>Max 5MB per file</span>
            <span>•</span>
            <span className="font-medium text-[#006699]">
              {uploadedPhotos.length}/5 uploaded
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.photos && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{errors.photos}</p>
        </div>
      )}

      {/* Uploaded Photos Grid */}
      {uploadedPhotos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Uploaded Photos ({uploadedPhotos.length})
            </h4>
            {uploadedPhotos.length >= 5 && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Minimum requirement met!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative group bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-[#006699] transition-all duration-200"
              >
                {/* Photo Image */}
                <div className="aspect-square relative">
                  <img
                    src={photo.url}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Primary Badge */}
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2 bg-[#006699] text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Cover</span>
                    </div>
                  )}

                  {/* Order Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>

                  {/* Hover Overlay with Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex flex-col space-y-2">
                      {/* Move Up/Down */}
                      <div className="flex items-center justify-center space-x-2">
                        {index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMovePhoto(photo.id, 'up');
                            }}
                            className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                            title="Move up"
                          >
                            <MoveUp className="h-4 w-4 text-gray-900" />
                          </button>
                        )}
                        {index < uploadedPhotos.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMovePhoto(photo.id, 'down');
                            }}
                            className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                            title="Move down"
                          >
                            <MoveDown className="h-4 w-4 text-gray-900" />
                          </button>
                        )}
                      </div>

                      {/* Set as Primary */}
                      {!photo.isPrimary && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimaryPhoto(photo.id);
                          }}
                          className="px-3 py-1.5 bg-[#006699] hover:bg-[#005588] text-white rounded-full text-xs font-medium transition-colors flex items-center space-x-1"
                        >
                          <Star className="h-3 w-3" />
                          <span>Set as Cover</span>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto(photo.id);
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {(photo.fileSize / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Photos Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#006699] dark:hover:border-[#006699] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-[#006699] dark:hover:text-[#006699]"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add More Photos</span>
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Photo Tips
        </h5>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
          <li>• Use high-resolution photos (at least 1024x683 pixels)</li>
          <li>• Capture different rooms and angles</li>
          <li>• Take photos in good lighting (daytime preferred)</li>
          <li>• Show special features and amenities</li>
          <li>• Keep photos recent and accurate</li>
        </ul>
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
            {formData.location?.lat !== 0 && formData.location?.lng !== 0 && (
              <p><strong>Coordinates:</strong> {formData.location?.lat.toFixed(6)}°, {formData.location?.lng.toFixed(6)}°</p>
            )}
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
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Photos ({uploadedPhotos.length})</h4>
          {uploadedPhotos.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {uploadedPhotos.slice(0, 8).map((photo, index) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <img src={photo.url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  {photo.isPrimary && (
                    <div className="absolute top-1 left-1 bg-[#006699] text-white px-1.5 py-0.5 rounded text-xs flex items-center space-x-1">
                      <Star className="h-2 w-2 fill-current" />
                      <span>Cover</span>
                    </div>
                  )}
                </div>
              ))}
              {uploadedPhotos.length > 8 && (
                <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">+{uploadedPhotos.length - 8} more</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No photos uploaded</p>
          )}
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
      case 'photos':
        return renderPhotosStep();
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
    { id: 'photos', name: 'Photos', icon: Camera },
    { id: 'houseRules', name: 'House Rules', icon: Shield },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'review', name: 'Review', icon: Eye }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header - Enhanced */}
        <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] rounded-2xl shadow-lg p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Create New Property Listing
                </h2>
                <p className="text-blue-100 flex items-center space-x-2">
                  <span>Add your property to start hosting guests</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    Professional
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 group"
              title="Cancel"
            >
              <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Progress Indicator - Modern Design */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {steps.findIndex(s => s.id === step) + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-[#006699] dark:text-blue-400">
                {Math.round(((steps.findIndex(s => s.id === step) + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#006699] to-[#0088cc] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((steps.findIndex(s => s.id === step) + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {steps.map((stepItem, index) => {
              const currentStepIndex = steps.findIndex(s => s.id === step);
              const isCompleted = index < currentStepIndex;
              const isCurrent = step === stepItem.id;
              const isUpcoming = index > currentStepIndex;

              return (
                <div key={stepItem.id} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCurrent 
                      ? 'bg-gradient-to-br from-[#006699] to-[#0088cc] shadow-lg shadow-[#006699]/30 scale-110' 
                      : isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <stepItem.icon className={`h-5 w-5 ${
                        isCurrent ? 'text-white' : isUpcoming ? 'text-gray-400 dark:text-gray-500' : 'text-white'
                      }`} />
                    )}
                    
                    {/* Pulse animation for current step */}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-[#006699] animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium transition-colors ${
                      isCurrent 
                        ? 'text-[#006699] dark:text-blue-400' 
                        : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {stepItem.name}
                    </p>
                    {isCurrent && (
                      <div className="mt-1 h-1 w-full bg-gradient-to-r from-[#006699] to-[#0088cc] rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons - Enhanced */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              {step !== 'basic' && (
                <button
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <svg className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous Step</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              {step === 'review' ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Create Listing</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#006699] to-[#0088cc] hover:from-[#005588] hover:to-[#0077bb] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-[#006699]/30 hover:shadow-xl hover:shadow-[#006699]/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 group"
                >
                  <span>Continue</span>
                  <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-4 w-4" />
                <span>Your progress is automatically saved</span>
              </div>
              
              {step !== 'review' && (
                <div className="text-gray-500 dark:text-gray-400">
                  {steps.length - steps.findIndex(s => s.id === step) - 1} steps remaining
                </div>
              )}
            </div>
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
                    // Extract city from address if available
                    const addressParts = location.address.split(',');
                    if (addressParts.length > 1) {
                      handleNestedInputChange('location', 'city', addressParts[addressParts.length - 2].trim());
                    }
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
