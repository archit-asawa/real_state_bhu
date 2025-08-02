import { connectDatabase, disconnectDatabase } from '../config/database';
import { PropertyModel } from '../models/Property';
import { Property } from '../types';

const sampleProperties: Partial<Property>[] = [
  {
    title: 'Luxury 3BHK Apartment in Downtown Mumbai',
    description: 'Spacious 3-bedroom apartment with modern amenities, located in the heart of Mumbai. Features include modular kitchen, wooden flooring, and 24/7 security.',
    price: 15000000,
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    amenities: ['Swimming Pool', 'Gym', 'Parking', '24/7 Security', 'Power Backup'],
    images: [
      'https://example.com/images/property1_1.jpg',
      'https://example.com/images/property1_2.jpg'
    ],
    status: 'available'
  },
  {
    title: 'Independent Villa in Gurgaon',
    description: 'Beautiful 4-bedroom independent villa with garden and garage. Perfect for families looking for spacious living in a peaceful environment.',
    price: 25000000,
    location: {
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
      coordinates: { lat: 28.4595, lng: 77.0266 }
    },
    propertyType: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    amenities: ['Garden', 'Garage', 'Security', 'Power Backup', 'Water Supply'],
    images: [
      'https://example.com/images/property2_1.jpg',
      'https://example.com/images/property2_2.jpg'
    ],
    status: 'available'
  },
  {
    title: '2BHK Flat in Koramangala, Bangalore',
    description: 'Modern 2-bedroom flat in the IT hub of Bangalore. Close to major tech companies and shopping centers.',
    price: 8500000,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1000,
    amenities: ['Gym', 'Club House', 'Swimming Pool', 'Parking'],
    images: [
      'https://example.com/images/property3_1.jpg'
    ],
    status: 'available'
  },
  {
    title: 'Commercial Space in Connaught Place, Delhi',
    description: 'Prime commercial space in the heart of Delhi. Ideal for retail businesses and offices.',
    price: 50000000,
    location: {
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      coordinates: { lat: 28.6315, lng: 77.2167 }
    },
    propertyType: 'office',
    bedrooms: 0,
    bathrooms: 2,
    area: 1500,
    amenities: ['Central AC', 'Elevator', 'Parking', '24/7 Security'],
    images: [
      'https://example.com/images/property4_1.jpg'
    ],
    status: 'available'
  },
  {
    title: 'Affordable 1BHK in Pune',
    description: 'Compact and well-designed 1-bedroom apartment perfect for young professionals.',
    price: 4500000,
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    amenities: ['Parking', 'Water Supply', '24/7 Security'],
    images: [
      'https://example.com/images/property5_1.jpg'
    ],
    status: 'available'
  },
  {
    title: 'Spacious House in Hyderabad',
    description: 'Traditional house with modern amenities. Great for large families.',
    price: 12000000,
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      coordinates: { lat: 17.3850, lng: 78.4867 }
    },
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    amenities: ['Garden', 'Parking', 'Borewell', 'Power Backup'],
    images: [
      'https://example.com/images/property6_1.jpg'
    ],
    status: 'available'
  },
  {
    title: 'Plot for Sale in Chennai',
    description: 'Residential plot in a developing area of Chennai. Perfect for building your dream home.',
    price: 6000000,
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    propertyType: 'land',
    bedrooms: 0,
    bathrooms: 0,
    area: 2000,
    amenities: ['Road Access', 'Electricity Connection'],
    images: [
      'https://example.com/images/property7_1.jpg'
    ],
    status: 'available'
  },
  {
    title: 'Luxury Penthouse in Mumbai',
    description: 'Exclusive penthouse with panoramic city views. Premium amenities and prime location.',
    price: 35000000,
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      coordinates: { lat: 19.0596, lng: 72.8295 }
    },
    propertyType: 'apartment',
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    amenities: ['Swimming Pool', 'Gym', 'Concierge', 'Valet Parking', 'Terrace Garden'],
    images: [
      'https://example.com/images/property8_1.jpg',
      'https://example.com/images/property8_2.jpg',
      'https://example.com/images/property8_3.jpg'
    ],
    status: 'available'
  }
];

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDatabase();
    
    // Clear existing properties
    await PropertyModel.deleteMany({});
    console.log('🗑️ Cleared existing properties');
    
    // Insert sample properties
    const properties = await PropertyModel.insertMany(sampleProperties);
    console.log(`✅ Successfully seeded ${properties.length} properties`);
    
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}
