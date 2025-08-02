import { config } from '@/config/environment';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = config.mongodb.testUri;

// Increase timeout for database operations
jest.setTimeout(30000);
