export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'apartment' | 'house' | 'villa' | 'office' | 'land';
  bedrooms: number;
  bathrooms: number;
  area: number; // in square feet
  amenities: string[];
  images: string[];
  listedDate: Date;
  status: 'available' | 'sold' | 'rented' | 'under_negotiation';
  createdAt: Date;
  updatedAt: Date;
}

export interface NearbyAmenity {
  type: AmenityType;
  name: string;
  address: string;
  distance: number; // in meters
  duration: number; // in seconds
  placeId: string;
  rating?: number;
  userRatingsTotal?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type AmenityType = 
  | 'hospital'
  | 'school'
  | 'restaurant'
  | 'shopping_mall'
  | 'bank'
  | 'gas_station'
  | 'pharmacy'
  | 'gym'
  | 'park'
  | 'bus_station'
  | 'train_station'
  | 'airport';

export interface SearchFilters {
  city?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  propertyType?: Property['propertyType'] | undefined;
  minBedrooms?: number | undefined;
  sortBy?: 'price' | 'listedDate' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchResponse {
  properties: Property[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProperties: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface NearbyAmenitiesResponse {
  property: {
    id: string;
    title: string;
    coordinates: { lat: number; lng: number };
  };
  amenities: {
    [key in AmenityType]?: NearbyAmenity[];
  };
  searchRadius: number;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
}

export interface DistanceMatrixResult {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
  status: string;
}
