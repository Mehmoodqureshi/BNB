'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, MapPin, Users, Shield, Camera, Eye, X, CheckCircle, DollarSign, UserCheck
} from 'lucide-react';
import { PropertyListing, PropertyPhoto } from '@/lib/types/host';
import Button from '../ui/Button';
import LocationPicker from '../host/LocationPicker';
import { fetchAllHosts, Host } from '@/lib/services/hostService';
import { defaultFormData, amenities } from '@/lib/constants/propertyData';
import {
  validatePropertyStep,
  validatePhotoFile,
  fileToPropertyPhoto,
  reorderPhotos,
  setPrimaryPhoto,
  movePhoto,
  toggleAmenity as toggleAmenityUtil,
  createPropertyListing,
  getNextStep,
  getPreviousStep,
  calculateProgress
} from '@/lib/utils/propertyFormUtils';
import {
  HostSelectionStep,
  BasicInfoStep,
  LocationStep,
  CapacityStep,
  AmenitiesStep,
  PricingStep
} from '../property/PropertyFormSteps';

interface AdminPropertyListingFormProps {
  onSubmit: (property: PropertyListing & { hostId: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PropertyListing>;
  isLoading?: boolean;
}

type Step = 'host' | 'basic' | 'location' | 'capacity' | 'amenities' | 'photos' | 'houseRules' | 'pricing' | 'review';

const AdminPropertyListingForm: React.FC<AdminPropertyListingFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [step, setStep] = useState<Step>('host');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<PropertyPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState<string>('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [formData, setFormData] = useState<Partial<PropertyListing>>(
    initialData || defaultFormData as Partial<PropertyListing>
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newHouseRule, setNewHouseRule] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showMapPopup, setShowMapPopup] = useState(false);

  const steps: Step[] = ['host', 'basic', 'location', 'capacity', 'amenities', 'photos', 'houseRules', 'pricing', 'review'];

  // Load hosts on mount
  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    const hostsData = await fetchAllHosts();
    setHosts(hostsData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleToggleAmenity = (amenityId: string) => {
    const result = toggleAmenityUtil(
      amenityId,
      selectedAmenities,
      formData.amenities || [],
      amenities
    );
    setSelectedAmenities(result.newSelected);
    setFormData(prev => ({ ...prev, amenities: result.newAmenities }));
  };

  const handleNext = () => {
    const validationErrors = validatePropertyStep(step, formData, uploadedPhotos, selectedHostId);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const nextStep = getNextStep(step, steps);
    if (nextStep) setStep(nextStep as Step);
  };

  const handlePrevious = () => {
    const prevStep = getPreviousStep(step, steps);
    if (prevStep) setStep(prevStep as Step);
  };

  // Photo upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    handleFiles(Array.from(files));
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const validation = validatePhotoFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = fileToPropertyPhoto(file, e.target?.result as string, uploadedPhotos.length);
        setUploadedPhotos(prev => [...prev, newPhoto]);
        setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), newPhoto] }));
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
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleRemovePhoto = (photoId: string) => {
    const updatedPhotos = uploadedPhotos.filter(p => p.id !== photoId);
    const reordered = reorderPhotos(updatedPhotos);
    setUploadedPhotos(reordered);
    setFormData(prev => ({ ...prev, photos: reordered }));
  };

  const handleSetPrimaryPhoto = (photoId: string) => {
    const updated = setPrimaryPhoto(uploadedPhotos, photoId);
    setUploadedPhotos(updated);
    setFormData(prev => ({ ...prev, photos: updated }));
  };

  const handleMovePhoto = (photoId: string, direction: 'up' | 'down') => {
    const moved = movePhoto(uploadedPhotos, photoId, direction);
    if (moved) {
      setUploadedPhotos(moved);
      setFormData(prev => ({ ...prev, photos: moved }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validatePropertyStep(step, formData, uploadedPhotos, selectedHostId);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const propertyData = createPropertyListing(formData, uploadedPhotos, selectedHostId, true);
    await onSubmit(propertyData as any);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'host':
        return (
          <HostSelectionStep
            hosts={hosts}
            selectedHostId={selectedHostId}
            onSelectHost={(hostId) => {
              setSelectedHostId(hostId);
              if (errors.hostId) {
                setErrors(prev => ({ ...prev, hostId: '' }));
              }
            }}
            error={errors.hostId}
          />
        );
      case 'basic':
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNestedInputChange={handleNestedInputChange}
          />
        );
      case 'location':
        return (
          <LocationStep
            formData={formData}
            errors={errors}
            onNestedInputChange={handleNestedInputChange}
            onShowMap={() => setShowMapPopup(true)}
          />
        );
      case 'capacity':
        return (
          <CapacityStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNestedInputChange={handleNestedInputChange}
          />
        );
      case 'amenities':
        return (
          <AmenitiesStep
            selectedAmenities={selectedAmenities}
            onToggleAmenity={handleToggleAmenity}
          />
        );
      case 'pricing':
        return (
          <PricingStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNestedInputChange={handleNestedInputChange}
          />
        );
      case 'photos':
        return renderPhotosStep();
      case 'houseRules':
        return renderHouseRulesStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  const renderPhotosStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Upload Photos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add at least 5 high-quality photos
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-[#006699] bg-[#006699]/5' 
            : 'border-gray-300 dark:border-gray-600 hover:border-[#006699]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          Drag and drop photos or click to browse
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {uploadedPhotos.length}/5 uploaded
        </p>
      </div>

      {errors.photos && (
        <p className="text-sm text-red-600 text-center">{errors.photos}</p>
      )}

      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHouseRulesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          House Rules
        </h3>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newHouseRule}
          onChange={(e) => setNewHouseRule(e.target.value)}
          placeholder="e.g., No smoking, No pets"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <Button onClick={addHouseRule} variant="secondary">
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {formData.houseRules?.map((rule, index) => (
          <div key={index} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-900 dark:text-white">{rule}</span>
            <button onClick={() => removeHouseRule(index)}>
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Review Property
        </h3>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Property Details</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Host:</strong> {hosts.find(h => h.id === selectedHostId)?.name}</p>
            <p><strong>Title:</strong> {formData.title}</p>
            <p><strong>Type:</strong> {formData.type} • {formData.propertyType}</p>
            <p><strong>Location:</strong> {formData.location?.emirate}</p>
            <p><strong>Price:</strong> AED {formData.pricing?.basePrice} per night</p>
            <p><strong>Photos:</strong> {uploadedPhotos.length} uploaded</p>
            <p><strong>Amenities:</strong> {selectedAmenities.length} selected</p>
          </div>
        </div>
      </div>
    </div>
  );

  const stepIcons = {
    host: UserCheck,
    basic: Home,
    location: MapPin,
    capacity: Users,
    amenities: Shield,
    photos: Camera,
    houseRules: Shield,
    pricing: DollarSign,
    review: Eye
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 overflow-y-auto z-50">
      <div className="min-h-screen p-4">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] rounded-t-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Add New Property (Admin)
                </h2>
                <p className="text-blue-100">
                  Create a property listing for a host
                </p>
              </div>
              <button onClick={onCancel} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {steps.indexOf(step) + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-[#006699]">
                {calculateProgress(step, steps)}% Complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#006699] to-[#0088cc] transition-all"
                style={{ width: `${calculateProgress(step, steps)}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <div>
                {step !== 'host' && (
                  <Button onClick={handlePrevious} variant="secondary" disabled={isLoading}>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-3">
                <Button onClick={onCancel} variant="secondary" disabled={isLoading}>
                  Cancel
                </Button>
                {step === 'review' ? (
                  <Button onClick={handleSubmit} variant="primary" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Property'}
                  </Button>
                ) : (
                  <Button onClick={handleNext} variant="primary" disabled={isLoading}>
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Popup */}
      {showMapPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[600px] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Property Location
                </h3>
                <button onClick={() => setShowMapPopup(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 h-full">
              <LocationPicker
                onLocationSelect={(location) => {
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
      )}
    </div>
  );
};

export default AdminPropertyListingForm;