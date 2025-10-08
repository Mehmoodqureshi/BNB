import React from 'react';
import { 
  Home, MapPin, Users, Shield, DollarSign, Camera, Eye,
  CheckCircle, AlertCircle, Navigation, Upload, ImageIcon,
  Plus, X, Star, Trash2, MoveUp, MoveDown, UserCheck
} from 'lucide-react';
import { PropertyListing, PropertyPhoto } from '@/lib/types/host';
import { propertyTypes, propertyCategories, amenities, emirates } from '@/lib/constants/propertyData';
import { Host } from '@/lib/services/hostService';
import Button from '../ui/Button';

interface BaseStepProps {
  formData: Partial<PropertyListing>;
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
  onNestedInputChange: (parent: string, field: string, value: any) => void;
}

interface HostStepProps {
  hosts: Host[];
  selectedHostId: string;
  onSelectHost: (hostId: string) => void;
  error?: string;
}

export const HostSelectionStep: React.FC<HostStepProps> = ({
  hosts,
  selectedHostId,
  onSelectHost,
  error
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <UserCheck className="h-12 w-12 text-[#006699] mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Select Host
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Choose which host this property belongs to
      </p>
    </div>

    <div className="space-y-3">
      {hosts.map((host) => (
        <button
          key={host.id}
          type="button"
          onClick={() => onSelectHost(host.id)}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
            selectedHostId === host.id
              ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                {host.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {host.email}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {host.properties} {host.properties === 1 ? 'property' : 'properties'}
              </div>
              {selectedHostId === host.id && (
                <CheckCircle className="h-6 w-6 text-[#006699] mt-1 ml-auto" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
    
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
    )}
  </div>
);

export const BasicInfoStep: React.FC<BaseStepProps> = ({
  formData,
  errors,
  onInputChange
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <Home className="h-12 w-12 text-[#006699] mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Tell us about this property
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Start with the basics about the property
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
          onChange={(e) => onInputChange('title', e.target.value)}
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
              onClick={() => onInputChange('type', type.value)}
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
              onClick={() => onInputChange('propertyType', category.value)}
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
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={4}
          placeholder="Describe the property in detail. What makes it special? What can guests expect?"
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

interface LocationStepProps {
  formData: Partial<PropertyListing>;
  errors: Record<string, string>;
  onNestedInputChange: (parent: string, field: string, value: any) => void;
  onShowMap: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  errors,
  onNestedInputChange,
  onShowMap
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <MapPin className="h-12 w-12 text-[#006699] mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Where's the property located?
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Help guests find this property
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
            placeholder="Select location on map or enter address"
            className={`w-full px-3 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.address ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            readOnly
          />
          <button
            type="button"
            onClick={onShowMap}
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
          Click the map icon to select the property location
        </p>
      </div>

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
          onChange={(e) => onNestedInputChange('location', 'emirate', e.target.value)}
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

export const CapacityStep: React.FC<BaseStepProps> = ({
  formData,
  onNestedInputChange
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <Users className="h-12 w-12 text-[#006699] mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        How many guests can this place accommodate?
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
          onChange={(e) => onNestedInputChange('capacity', 'guests', parseInt(e.target.value))}
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
          onChange={(e) => onNestedInputChange('capacity', 'bedrooms', parseInt(e.target.value))}
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
          onChange={(e) => onNestedInputChange('capacity', 'bathrooms', parseFloat(e.target.value))}
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
          onChange={(e) => onNestedInputChange('capacity', 'beds', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  </div>
);

interface AmenitiesStepProps {
  selectedAmenities: string[];
  onToggleAmenity: (amenityId: string) => void;
}

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  selectedAmenities,
  onToggleAmenity
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <Shield className="h-12 w-12 text-[#006699] mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        What amenities are available?
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Select all amenities available at the property
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {amenities.map((amenity) => (
        <button
          key={amenity.id}
          type="button"
          onClick={() => onToggleAmenity(amenity.id)}
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

export const PricingStep: React.FC<BaseStepProps> = ({
  formData,
  errors,
  onNestedInputChange
}) => (
  <div className="space-y-6">
    <div className="text-center">
      <DollarSign className="h-12 w-12 text-[#006699] mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Set the pricing
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        How much should be charged per night?
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
          onChange={(e) => onNestedInputChange('pricing', 'basePrice', parseInt(e.target.value))}
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
            onChange={(e) => onNestedInputChange('pricing', 'cleaningFee', parseInt(e.target.value))}
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
            onChange={(e) => onNestedInputChange('pricing', 'securityDeposit', parseInt(e.target.value))}
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
            onChange={(e) => onNestedInputChange('availability', 'minimumStay', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="instantBook"
            checked={formData.availability?.instantBook || false}
            onChange={(e) => onNestedInputChange('availability', 'instantBook', e.target.checked)}
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
