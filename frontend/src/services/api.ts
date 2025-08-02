import axios from 'axios';
import { 
  Property, 
  SearchParams, 
  RadiusSearchParams, 
  ApiResponse, 
  SearchResponse,
  Amenity 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    
    // Setup axios defaults
    axios.defaults.baseURL = this.baseURL;
    axios.defaults.timeout = 10000;
    
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await axios.get('/health');
    return response.data;
  }

  // Search properties
  async searchProperties(params: SearchParams): Promise<SearchResponse> {
    const response = await axios.get<ApiResponse<SearchResponse>>('/properties/search', {
      params: this.cleanParams(params)
    });
    return response.data.data;
  }

  // Search properties within radius
  async searchPropertiesInRadius(params: RadiusSearchParams): Promise<SearchResponse> {
    const response = await axios.get<ApiResponse<SearchResponse>>('/properties/search-radius', {
      params: this.cleanParams(params)
    });
    return response.data.data;
  }

  // Get property by ID
  async getPropertyById(id: string): Promise<Property> {
    const response = await axios.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data.data;
  }

  // Create property (for admin/agents)
  async createProperty(propertyData: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const response = await axios.post<ApiResponse<Property>>('/properties', propertyData);
    return response.data.data;
  }

  // Update property
  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    const response = await axios.put<ApiResponse<Property>>(`/properties/${id}`, propertyData);
    return response.data.data;
  }

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    await axios.delete(`/properties/${id}`);
  }

  // Get all properties (with pagination)
  async getAllProperties(page: number = 1, limit: number = 20): Promise<SearchResponse> {
    const response = await axios.get<ApiResponse<SearchResponse>>('/properties', {
      params: { page, limit }
    });
    return response.data.data;
  }

  // Get nearby amenities
  async getNearbyAmenities(propertyId: string, radius: number = 5000): Promise<Amenity[]> {
    const response = await axios.get<ApiResponse<Amenity[]>>(`/properties/${propertyId}/amenities`, {
      params: { radius }
    });
    return response.data.data;
  }

  // Utility method to clean undefined params
  private cleanParams(params: any): any {
    const cleaned: any = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }

  // Format price for display
  static formatPrice(price: number): string {
    if (price >= 10000000) { // 1 crore
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) { // 1 lakh
      return `₹${(price / 100000).toFixed(1)} L`;
    } else if (price >= 1000) { // 1 thousand
      return `₹${(price / 1000).toFixed(1)} K`;
    }
    return `₹${price.toLocaleString()}`;
  }

  // Format area for display
  static formatArea(area: number): string {
    return `${area.toLocaleString()} sq ft`;
  }

  // Get property type display name
  static getPropertyTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      apartment: 'Apartment',
      house: 'House',
      villa: 'Villa',
      office: 'Office',
      land: 'Land'
    };
    return types[type] || type;
  }

  // Get status badge color
  static getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}

export const apiService = new ApiService();
export { ApiService };
export default apiService;
