import { PropertyListing, PropertyAmenity, PropertyPhoto } from '@/lib/types/host';

/**
 * Validates a specific step in the property form
 */
export const validatePropertyStep = (
  stepName: string,
  formData: Partial<PropertyListing>,
  uploadedPhotos: PropertyPhoto[],
  selectedHostId?: string
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  switch (stepName) {
    case 'host':
      if (selectedHostId !== undefined && !selectedHostId) {
        newErrors.hostId = 'Please select a host for this property';
      }
      break;
    case 'basic':
      if (!formData.title?.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!formData.description?.trim()) {
        newErrors.description = 'Description is required';
      }
      if (formData.description && formData.description.length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
      break;
    case 'location':
      if (!formData.location?.address?.trim()) {
        newErrors.address = 'Property location is required';
      }
      if (!formData.location?.emirate) {
        newErrors.emirate = 'Emirate is required';
      }
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

  return newErrors;
};

/**
 * Handles file validation for property photos
 */
export const validatePhotoFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: `${file.name} is not an image file` };
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: `${file.name} is too large. Maximum size is 5MB` };
  }
  
  return { valid: true };
};

/**
 * Converts a file to a PropertyPhoto object
 */
export const fileToPropertyPhoto = (
  file: File,
  dataUrl: string,
  currentPhotoCount: number
): PropertyPhoto => {
  return {
    id: `photo-${Date.now()}-${Math.random()}`,
    url: dataUrl,
    isPrimary: currentPhotoCount === 0,
    order: currentPhotoCount + 1,
    uploadedAt: new Date().toISOString(),
    fileSize: file.size,
    dimensions: { width: 0, height: 0 }
  };
};

/**
 * Reorders photos after deletion or reordering
 */
export const reorderPhotos = (photos: PropertyPhoto[]): PropertyPhoto[] => {
  return photos.map((photo, index) => ({
    ...photo,
    order: index + 1,
    isPrimary: index === 0
  }));
};

/**
 * Sets a photo as primary
 */
export const setPrimaryPhoto = (photos: PropertyPhoto[], photoId: string): PropertyPhoto[] => {
  return photos.map(photo => ({
    ...photo,
    isPrimary: photo.id === photoId
  }));
};

/**
 * Moves a photo up or down in the order
 */
export const movePhoto = (
  photos: PropertyPhoto[],
  photoId: string,
  direction: 'up' | 'down'
): PropertyPhoto[] | null => {
  const currentIndex = photos.findIndex(p => p.id === photoId);
  if (currentIndex === -1) return null;
  
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (newIndex < 0 || newIndex >= photos.length) return null;
  
  const newPhotos = [...photos];
  [newPhotos[currentIndex], newPhotos[newIndex]] = [newPhotos[newIndex], newPhotos[currentIndex]];
  
  return reorderPhotos(newPhotos);
};

/**
 * Toggles an amenity in the selected amenities list
 */
export const toggleAmenity = (
  amenityId: string,
  selectedAmenities: string[],
  currentAmenities: PropertyAmenity[],
  allAmenities: PropertyAmenity[]
): { newAmenities: PropertyAmenity[]; newSelected: string[] } => {
  const amenity = allAmenities.find(a => a.id === amenityId);
  if (!amenity) {
    return { newAmenities: currentAmenities, newSelected: selectedAmenities };
  }

  const isSelected = selectedAmenities.includes(amenityId);
  let newAmenities: PropertyAmenity[];
  let newSelected: string[];

  if (isSelected) {
    newAmenities = currentAmenities.filter(a => a.id !== amenityId);
    newSelected = selectedAmenities.filter(id => id !== amenityId);
  } else {
    newAmenities = [...currentAmenities, { ...amenity, isIncluded: true }];
    newSelected = [...selectedAmenities, amenityId];
  }

  return { newAmenities, newSelected };
};

/**
 * Creates a complete property listing object
 */
export const createPropertyListing = (
  formData: Partial<PropertyListing>,
  uploadedPhotos: PropertyPhoto[],
  hostId: string,
  isAdminCreated: boolean = false
): PropertyListing => {
  return {
    id: `property-${Date.now()}`,
    hostId: hostId,
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
    status: isAdminCreated ? 'approved' : 'draft',
    isActive: isAdminCreated,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Navigates to the next step in the form
 */
export const getNextStep = (currentStep: string, steps: string[]): string | null => {
  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex < steps.length - 1) {
    return steps[currentIndex + 1];
  }
  return null;
};

/**
 * Navigates to the previous step in the form
 */
export const getPreviousStep = (currentStep: string, steps: string[]): string | null => {
  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex > 0) {
    return steps[currentIndex - 1];
  }
  return null;
};

/**
 * Calculates progress percentage
 */
export const calculateProgress = (currentStep: string, steps: string[]): number => {
  const currentIndex = steps.findIndex(s => s === currentStep);
  return Math.round(((currentIndex + 1) / steps.length) * 100);
};
