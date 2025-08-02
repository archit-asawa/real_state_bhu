// API Types
export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address?: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'apartment' | 'house' | 'villa' | 'office' | 'land';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  amenities: string[];
  images: string[];
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  city?: string;
  state?: string;
  pincode?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RadiusSearchParams {
  lat: number;
  lng: number;
  radius: number;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProperties: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SearchResponse {
  properties: Property[];
  pagination: PaginationInfo;
}

export interface Amenity {
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
}

// Component Props Types
export interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

export interface MapProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (property: Property) => void;
  selectedProperty?: Property | null;
}

export interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export interface FilterProps {
  onFilterChange: (filters: Partial<SearchParams>) => void;
  currentFilters: SearchParams;
}

// Filter Options
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'office', label: 'Office' },
  { value: 'land', label: 'Land' },
] as const;

export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'area_asc', label: 'Area: Small to Large' },
  { value: 'area_desc', label: 'Area: Large to Small' },
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
] as const;

export const COMMON_AMENITIES = [
  'Parking',
  'Security',
  'Gym',
  'Swimming Pool',
  'Garden',
  'Elevator',
  'Power Backup',
  'Water Supply',
  'Internet',
  'Air Conditioning',
  'Balcony',
  'Terrace',
] as const;
