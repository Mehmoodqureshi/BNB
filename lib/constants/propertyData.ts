import { Home } from 'lucide-react';
import { PropertyAmenity } from '@/lib/types/host';

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment', icon: Home },
  { value: 'house', label: 'House', icon: Home },
  { value: 'villa', label: 'Villa', icon: Home },
  { value: 'condo', label: 'Condo', icon: Home },
  { value: 'studio', label: 'Studio', icon: Home },
  { value: 'penthouse', label: 'Penthouse', icon: Home },
  { value: 'townhouse', label: 'Townhouse', icon: Home }
];

export const propertyCategories = [
  { 
    value: 'entire_place', 
    label: 'Entire place', 
    description: 'Guests have the whole place to themselves' 
  },
  { 
    value: 'private_room', 
    label: 'Private room', 
    description: 'Guests have their own room in a home, plus access to shared spaces' 
  },
  { 
    value: 'shared_room', 
    label: 'Shared room', 
    description: 'Guests sleep in a room or common area that may be shared with you or others' 
  }
];

export const amenities: PropertyAmenity[] = [
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

export const emirates = [
  'Dubai', 
  'Abu Dhabi', 
  'Sharjah', 
  'Ajman', 
  'Ras Al Khaimah', 
  'Fujairah', 
  'Umm Al Quwain'
];

export const defaultFormData = {
  title: '',
  description: '',
  type: 'apartment' as const,
  propertyType: 'entire_place' as const,
  capacity: {
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1
  },
  location: {
    address: '',
    city: '',
    emirate: 'Dubai' as const,
    country: 'UAE',
    lat: 0,
    lng: 0
  },
  amenities: [],
  houseRules: [],
  pricing: {
    basePrice: 0,
    currency: 'AED' as const,
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
  photos: []
};
