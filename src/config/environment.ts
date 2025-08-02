import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongodb: {
    uri: string;
    testUri: string;
  };
  redis: {
    enabled: boolean;
    host: string;
    port: number;
    password?: string;
  };
  // Google Maps API temporarily disabled
  googleMaps: {
    apiKey: string;
  };
  cache: {
    ttl: number;
    amenityTtl: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
  search: {
    maxRadius: number;
    defaultRadius: number;
  };
  allowedOrigins: string[];
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bhu-expert',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/bhu-expert-test',
  },
  redis: {
    enabled: process.env.REDIS_ENABLED !== 'false',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  // Google Maps API temporarily disabled
  googleMaps: {
    apiKey: '', // process.env.GOOGLE_MAPS_API_KEY || '',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
    amenityTtl: parseInt(process.env.AMENITY_CACHE_TTL || '7200', 10),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
  },
  search: {
    maxRadius: parseInt(process.env.MAX_SEARCH_RADIUS || '50000', 10),
    defaultRadius: parseInt(process.env.DEFAULT_SEARCH_RADIUS || '5000', 10),
  },
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
};
