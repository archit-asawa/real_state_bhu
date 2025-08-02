import { PropertyModel, PropertyDocument } from '../models/Property';
import { GoogleMapsService } from '../services/GoogleMapsService';
import { amenityCache } from '../services/AmenityCache';
import { 
  Property, 
  SearchFilters, 
  PaginationParams, 
  SearchResponse, 
  AmenityType,
  NearbyAmenitiesResponse 
} from '../types';
import { CustomError } from '../middleware/errorHandler';
import { config } from '../config/environment';

export class PropertyService {
  private googleMapsService: GoogleMapsService;

  constructor() {
    this.googleMapsService = new GoogleMapsService();
  }

  async searchProperties(
    filters: SearchFilters,
    pagination: PaginationParams
  ): Promise<SearchResponse> {
    try {
      // Mock data for when database is not connected
      const mockProperties: Property[] = [
        {
          _id: '1',
          title: 'Luxury 3BHK Apartment in Bandra',
          description: 'Spacious 3-bedroom apartment with modern amenities and sea view',
          price: 15000000,
          location: {
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            coordinates: { lat: 19.0596, lng: 72.8295 }
          },
          propertyType: 'apartment',
          bedrooms: 3,
          bathrooms: 2,
          area: 1200,
          amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security'],
          images: ['https://via.placeholder.com/400x300/4338ca/ffffff?text=Luxury+Apartment'],
          listedDate: new Date('2024-01-15'),
          status: 'available',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          title: 'Modern 2BHK House in Pune',
          description: 'Beautiful house with garden and ample parking space',
          price: 8500000,
          location: {
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411001',
            coordinates: { lat: 18.5204, lng: 73.8567 }
          },
          propertyType: 'house',
          bedrooms: 2,
          bathrooms: 2,
          area: 1000,
          amenities: ['Parking', 'Garden', 'Security', 'Power Backup'],
          images: ['https://via.placeholder.com/400x300/059669/ffffff?text=Modern+House'],
          listedDate: new Date('2024-01-20'),
          status: 'available',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20')
        },
        {
          _id: '3',
          title: 'Spacious Villa in Goa',
          description: 'Luxurious villa with private pool and beach access',
          price: 25000000,
          location: {
            city: 'Goa',
            state: 'Goa',
            pincode: '403001',
            coordinates: { lat: 15.2993, lng: 74.1240 }
          },
          propertyType: 'villa',
          bedrooms: 4,
          bathrooms: 3,
          area: 2500,
          amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Beach Access'],
          images: ['https://via.placeholder.com/400x300/dc2626/ffffff?text=Luxury+Villa'],
          listedDate: new Date('2024-01-25'),
          status: 'available',
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-01-25')
        },
        {
          _id: '4',
          title: 'Commercial Space in Delhi',
          description: 'Prime commercial property in business district',
          price: 12000000,
          location: {
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            coordinates: { lat: 28.7041, lng: 77.1025 }
          },
          propertyType: 'office',
          bedrooms: 0,
          bathrooms: 2,
          area: 800,
          amenities: ['Parking', 'Elevator', 'Security', 'Power Backup'],
          images: ['https://via.placeholder.com/400x300/7c3aed/ffffff?text=Commercial+Space'],
          listedDate: new Date('2024-01-30'),
          status: 'available',
          createdAt: new Date('2024-01-30'),
          updatedAt: new Date('2024-01-30')
        },
        {
          _id: '5',
          title: 'Residential Plot in Bangalore',
          description: 'Well-located plot for construction with all approvals',
          price: 6000000,
          location: {
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            coordinates: { lat: 12.9716, lng: 77.5946 }
          },
          propertyType: 'land',
          bedrooms: 0,
          bathrooms: 0,
          area: 1500,
          amenities: ['Road Access', 'Water Supply', 'Electricity'],
          images: ['https://via.placeholder.com/400x300/059669/ffffff?text=Residential+Plot'],
          listedDate: new Date('2024-02-01'),
          status: 'available',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01')
        }
      ];

      // Apply filters to mock data
      let filteredProperties = mockProperties.filter(property => {
        // City filter
        if (filters.city && !property.location.city.toLowerCase().includes(filters.city.toLowerCase())) {
          return false;
        }
        
        // Price filters
        if (filters.minPrice !== undefined && property.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
          return false;
        }
        
        // Property type filter
        if (filters.propertyType && property.propertyType !== filters.propertyType) {
          return false;
        }
        
        // Bedrooms filter
        if (filters.minBedrooms !== undefined && property.bedrooms < filters.minBedrooms) {
          return false;
        }
        
        return true;
      });

      // Apply sorting
      if (filters.sortBy) {
        filteredProperties.sort((a, b) => {
          const aValue = filters.sortBy === 'price' ? a.price : new Date(a.listedDate).getTime();
          const bValue = filters.sortBy === 'price' ? b.price : new Date(b.listedDate).getTime();
          
          if (filters.sortOrder === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });
      }

      // Apply pagination
      const limit = Math.min(pagination.limit, 20);
      const skip = (pagination.page - 1) * limit;
      const paginatedProperties = filteredProperties.slice(skip, skip + limit);
      const totalCount = filteredProperties.length;
      const totalPages = Math.ceil(totalCount / limit);

      console.log('🏠 PropertyService: Returning mock data', {
        total: totalCount,
        page: pagination.page,
        limit,
        filters
      });

      return {
        properties: paginatedProperties,
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalProperties: totalCount,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };

      // Original database code (commented out for now)
      /*
      const query: any = { status: 'available' };

      // Build dynamic query based on filters
      if (filters.city) {
        query['location.city'] = { $regex: new RegExp(filters.city, 'i') };
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
      }

      if (filters.propertyType) {
        query.propertyType = filters.propertyType;
      }

      if (filters.minBedrooms !== undefined) {
        query.bedrooms = { $gte: filters.minBedrooms };
      }

      // Calculate pagination
      const limit = Math.min(pagination.limit, config.pagination.maxPageSize);
      const skip = (pagination.page - 1) * limit;

      // Build sort object
      const sortField = filters.sortBy || 'listedDate';
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      const sort: any = { [sortField]: sortOrder };

      // Execute query with pagination
      const [properties, totalCount] = await Promise.all([
        PropertyModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        PropertyModel.countDocuments(query).exec(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        properties: properties as Property[],
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalProperties: totalCount,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
      */
    } catch (error) {
      console.error('Error searching properties:', error);
      throw new CustomError('Failed to search properties', 500);
    }
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      // Mock data for property details
      const mockProperty: Property = {
        _id: id,
        title: 'Luxury 3BHK Apartment in Bandra',
        description: 'Spacious 3-bedroom apartment with modern amenities and sea view. This beautiful property features contemporary design, premium finishes, and breathtaking views of the Arabian Sea.',
        price: 15000000,
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          coordinates: { lat: 19.0596, lng: 72.8295 }
        },
        propertyType: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Balcony', 'Air Conditioning'],
        images: [
          'https://via.placeholder.com/800x600/4338ca/ffffff?text=Main+View',
          'https://via.placeholder.com/800x600/059669/ffffff?text=Living+Room',
          'https://via.placeholder.com/800x600/dc2626/ffffff?text=Bedroom',
          'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Kitchen'
        ],
        listedDate: new Date('2024-01-15'),
        status: 'available',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      };

      console.log('🏠 PropertyService: Returning mock property for ID:', id);
      return mockProperty;

      // Original database code (commented out for now)
      /*
      const property = await PropertyModel.findById(id).lean().exec();
      return property as Property | null;
      */
    } catch (error) {
      console.error('Error getting property by ID:', error);
      throw new CustomError('Failed to get property', 500);
    }
  }

  async createProperty(propertyData: Partial<Property>): Promise<Property> {
    try {
      // Geocode address if coordinates not provided (Google Maps temporarily disabled)
      if (propertyData.location && !propertyData.location.coordinates) {
        try {
          const address = `${propertyData.location.city}, ${propertyData.location.state}, ${propertyData.location.pincode}`;
          const coordinates = await this.googleMapsService.geocodeAddress(address);
          if (coordinates) {
            propertyData.location.coordinates = coordinates;
          }
        } catch (geocodeError) {
          console.log('🗺️ Geocoding skipped - Google Maps API disabled');
          // Continue without coordinates - not a fatal error
        }
      }

      const property = new PropertyModel(propertyData);
      const savedProperty = await property.save();
      return savedProperty.toJSON() as Property;
    } catch (error) {
      console.error('Error creating property:', error);
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new CustomError('Invalid property data', 400);
      }
      throw new CustomError('Failed to create property', 500);
    }
  }

  async updateProperty(id: string, updateData: Partial<Property>): Promise<Property | null> {
    try {
      // Geocode address if location is updated and coordinates not provided (Google Maps temporarily disabled)
      if (updateData.location && !updateData.location.coordinates) {
        try {
          const address = `${updateData.location.city}, ${updateData.location.state}, ${updateData.location.pincode}`;
          const coordinates = await this.googleMapsService.geocodeAddress(address);
          if (coordinates) {
            updateData.location.coordinates = coordinates;
          }
        } catch (geocodeError) {
          console.log('🗺️ Geocoding skipped - Google Maps API disabled');
          // Continue without coordinates - not a fatal error
        }
      }

      const property = await PropertyModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean().exec();

      if (property) {
        // Invalidate cache for this property
        await amenityCache.invalidate(id);
      }

      return property as Property | null;
    } catch (error) {
      console.error('Error updating property:', error);
      if (error instanceof Error && error.name === 'ValidationError') {
        throw new CustomError('Invalid property data', 400);
      }
      throw new CustomError('Failed to update property', 500);
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      const result = await PropertyModel.findByIdAndDelete(id).exec();
      
      if (result) {
        // Invalidate cache for this property
        await amenityCache.invalidate(id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw new CustomError('Failed to delete property', 500);
    }
  }

  async getNearbyAmenities(
    propertyId: string,
    amenityTypes: AmenityType[],
    radius: number = config.search.defaultRadius
  ): Promise<NearbyAmenitiesResponse> {
    try {
      // Get property details
      const property = await this.getPropertyById(propertyId);
      if (!property) {
        throw new CustomError('Property not found', 404);
      }

      if (!property.location.coordinates) {
        throw new CustomError('Property coordinates not available', 400);
      }

      const { lat, lng } = property.location.coordinates;
      const amenitiesResult: { [key in AmenityType]?: any[] } = {};

      // Process each amenity type
      for (const amenityType of amenityTypes) {
        // Check cache first
        const cached = await amenityCache.get(propertyId, amenityType, radius);
        if (cached) {
          amenitiesResult[amenityType] = cached;
          continue;
        }

        // Fetch from Google Maps API if not cached (Google Maps temporarily disabled)
        try {
          const amenities = await this.googleMapsService.processNearbyAmenities(
            { lat, lng },
            [amenityType],
            radius
          );

          if (amenities[amenityType]) {
            amenitiesResult[amenityType] = amenities[amenityType];
            // Cache the result
            await amenityCache.set(
              propertyId, 
              amenityType, 
              amenities[amenityType] || [], 
              config.cache.amenityTtl,
              radius
            );
          }
        } catch (error) {
          console.error(`Error fetching ${amenityType} amenities:`, error);
          // Continue with other amenity types even if one fails
          amenitiesResult[amenityType] = [];
        }
      }

      return {
        property: {
          id: property._id,
          title: property.title,
          coordinates: { lat, lng },
        },
        amenities: amenitiesResult,
        searchRadius: radius,
        timestamp: new Date(),
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error('Error getting nearby amenities:', error);
      throw new CustomError('Failed to get nearby amenities', 500);
    }
  }

  async getPropertiesWithinRadius(
    lat: number,
    lng: number,
    radius: number,
    filters: SearchFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<SearchResponse> {
    try {
      const query: any = {
        status: 'available',
        'location.coordinates': {
          $geoWithin: {
            $centerSphere: [[lng, lat], radius / 6378100] // Convert meters to radians
          }
        }
      };

      // Apply additional filters
      if (filters.propertyType) {
        query.propertyType = filters.propertyType;
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
      }

      if (filters.minBedrooms !== undefined) {
        query.bedrooms = { $gte: filters.minBedrooms };
      }

      // Calculate pagination
      const limit = Math.min(pagination.limit, config.pagination.maxPageSize);
      const skip = (pagination.page - 1) * limit;

      // Build sort object with distance priority
      const sort: any = {
        'location.coordinates': { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] } } }
      };

      const [properties, totalCount] = await Promise.all([
        PropertyModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        PropertyModel.countDocuments(query).exec(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        properties: properties as Property[],
        pagination: {
          currentPage: pagination.page,
          totalPages,
          totalProperties: totalCount,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      console.error('Error searching properties within radius:', error);
      throw new CustomError('Failed to search properties within radius', 500);
    }
  }
}
