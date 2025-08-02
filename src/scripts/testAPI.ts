import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class APITester {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async testHealthCheck(): Promise<void> {
    try {
      console.log('🏥 Testing health check...');
      const response = await axios.get('http://localhost:3000/health');
      console.log('✅ Health check passed:', response.data);
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }

  async testSearchProperties(): Promise<void> {
    try {
      console.log('\n🔍 Testing property search...');
      const response = await axios.get(`${this.baseURL}/properties/search`, {
        params: {
          city: 'Mumbai',
          minPrice: 1000000,
          maxPrice: 20000000,
          propertyType: 'apartment',
          page: 1,
          limit: 5
        }
      });
      console.log('✅ Property search passed:', {
        count: response.data.data.properties.length,
        pagination: response.data.data.pagination
      });
    } catch (error: any) {
      console.error('❌ Property search failed:', error.response?.data || error.message);
    }
  }

  async testCreateProperty(): Promise<string | null> {
    try {
      console.log('\n➕ Testing property creation...');
      const propertyData = {
        title: 'Test Property for API',
        description: 'This is a test property created via API',
        price: 5000000,
        location: {
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1000,
        amenities: ['Parking', 'Security'],
        images: ['https://example.com/test.jpg'],
        status: 'available'
      };

      const response = await axios.post(`${this.baseURL}/properties`, propertyData);
      console.log('✅ Property creation passed:', response.data.data._id);
      return response.data.data._id;
    } catch (error: any) {
      console.error('❌ Property creation failed:', error.response?.data || error.message);
      return null;
    }
  }

  async testGetPropertyById(propertyId: string): Promise<void> {
    try {
      console.log('\n🏠 Testing get property by ID...');
      const response = await axios.get(`${this.baseURL}/properties/${propertyId}`);
      console.log('✅ Get property by ID passed:', response.data.data.title);
    } catch (error: any) {
      console.error('❌ Get property by ID failed:', error.response?.data || error.message);
    }
  }

  async testSearchWithinRadius(): Promise<void> {
    try {
      console.log('\n📍 Testing search within radius...');
      const response = await axios.get(`${this.baseURL}/properties/search-radius`, {
        params: {
          lat: 19.0760,
          lng: 72.8777,
          radius: 10000,
          propertyType: 'apartment',
          page: 1,
          limit: 3
        }
      });
      console.log('✅ Search within radius passed:', {
        count: response.data.data.properties.length,
        message: response.data.message
      });
    } catch (error: any) {
      console.error('❌ Search within radius failed:', error.response?.data || error.message);
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting API Tests...\n');

    await this.testHealthCheck();
    await this.testSearchProperties();
    
    const propertyId = await this.testCreateProperty();
    if (propertyId) {
      await this.testGetPropertyById(propertyId);
    }
    
    await this.testSearchWithinRadius();

    console.log('\n🎉 API Testing completed!');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests().catch(console.error);
}

export { APITester };
