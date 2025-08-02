import { PropertyService } from '../services/PropertyService';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { PropertyModel } from '../models/Property';

describe('PropertyService', () => {
  let propertyService: PropertyService;

  beforeAll(async () => {
    await connectDatabase();
    propertyService = new PropertyService();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await PropertyModel.deleteMany({});
  });

  describe('searchProperties', () => {
    it('should return empty results when no properties exist', async () => {
      const result = await propertyService.searchProperties(
        {},
        { page: 1, limit: 10 }
      );

      expect(result.properties).toHaveLength(0);
      expect(result.pagination.totalProperties).toBe(0);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should filter properties by city', async () => {
      // Create test properties
      await PropertyModel.create([
        {
          title: 'Test Property 1',
          description: 'Test description',
          price: 1000000,
          location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
          propertyType: 'apartment',
          bedrooms: 2,
          bathrooms: 1,
          area: 1000,
          amenities: [],
          images: [],
          status: 'available'
        },
        {
          title: 'Test Property 2',
          description: 'Test description',
          price: 2000000,
          location: { city: 'Delhi', state: 'Delhi', pincode: '110001' },
          propertyType: 'house',
          bedrooms: 3,
          bathrooms: 2,
          area: 1500,
          amenities: [],
          images: [],
          status: 'available'
        }
      ]);

      const result = await propertyService.searchProperties(
        { city: 'Mumbai' },
        { page: 1, limit: 10 }
      );

      expect(result.properties).toHaveLength(1);
      expect(result.properties[0].location.city).toBe('Mumbai');
    });

    it('should filter properties by price range', async () => {
      await PropertyModel.create([
        {
          title: 'Cheap Property',
          description: 'Test description',
          price: 500000,
          location: { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
          propertyType: 'apartment',
          bedrooms: 1,
          bathrooms: 1,
          area: 500,
          amenities: [],
          images: [],
          status: 'available'
        },
        {
          title: 'Expensive Property',
          description: 'Test description',
          price: 5000000,
          location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
          propertyType: 'villa',
          bedrooms: 4,
          bathrooms: 3,
          area: 2000,
          amenities: [],
          images: [],
          status: 'available'
        }
      ]);

      const result = await propertyService.searchProperties(
        { minPrice: 1000000, maxPrice: 10000000 },
        { page: 1, limit: 10 }
      );

      expect(result.properties).toHaveLength(1);
      expect(result.properties[0].price).toBe(5000000);
    });
  });

  describe('createProperty', () => {
    it('should create a new property', async () => {
      const propertyData = {
        title: 'New Test Property',
        description: 'A new test property',
        price: 1500000,
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        propertyType: 'apartment' as const,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        amenities: ['Parking', 'Gym'],
        images: ['https://example.com/image1.jpg'],
        status: 'available' as const
      };

      const createdProperty = await propertyService.createProperty(propertyData);

      expect(createdProperty.title).toBe(propertyData.title);
      expect(createdProperty.price).toBe(propertyData.price);
      expect(createdProperty.location.city).toBe(propertyData.location.city);
      expect(createdProperty._id).toBeDefined();
    });
  });

  describe('getPropertyById', () => {
    it('should return null for non-existent property', async () => {
      const result = await propertyService.getPropertyById('507f1f77bcf86cd799439011');
      expect(result).toBeNull();
    });

    it('should return property for valid ID', async () => {
      const property = await PropertyModel.create({
        title: 'Test Property',
        description: 'Test description',
        price: 1000000,
        location: { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 1500,
        amenities: [],
        images: [],
        status: 'available'
      });

      const result = await propertyService.getPropertyById(property._id.toString());
      
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Test Property');
      expect(result?.price).toBe(1000000);
    });
  });
});
