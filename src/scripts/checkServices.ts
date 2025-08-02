import { connectDatabase } from '../config/database';
import { connectRedis } from '../config/redis';

async function checkServices() {
  console.log('🔍 Checking Backend Services...\n');

  // Check MongoDB
  try {
    await connectDatabase();
    console.log('✅ MongoDB: Connected successfully');
  } catch (error) {
    console.log('❌ MongoDB: Connection failed');
    console.log('   Make sure MongoDB is running on mongodb://localhost:27017');
    console.log('   Start it with: mongod\n');
  }

  // Check Redis (optional)
  try {
    await connectRedis();
    console.log('✅ Redis: Connected successfully (caching enabled)');
  } catch (error) {
    console.log('⚠️  Redis: Not connected (caching disabled, but app will work)');
    console.log('   Start Redis if you want caching: redis-server\n');
  }

  // Check Google Maps API Key
  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (googleApiKey && googleApiKey !== 'your_google_maps_api_key_here') {
    console.log('✅ Google Maps API: Key configured');
  } else {
    console.log('⚠️  Google Maps API: Key not configured');
    console.log('   Add your API key to .env file for nearby amenities feature\n');
  }

  console.log('🚀 Ready to start the server!');
  console.log('   Run: npm run dev');
}

checkServices().catch(console.error);
