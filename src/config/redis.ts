import { createClient, RedisClientType } from 'redis';
import { config } from '../config/environment';

let redisClient: RedisClientType | null = null;
let connectionAttempted = false;

export const connectRedis = async (): Promise<void> => {
  // Check if Redis is enabled
  if (!config.redis.enabled) {
    console.log('🔴 Redis: Disabled in configuration, using in-memory cache only');
    return;
  }

  // Prevent multiple connection attempts
  if (connectionAttempted) {
    return;
  }
  connectionAttempted = true;

  try {
    redisClient = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
        reconnectStrategy: (retries) => {
          // Stop retrying after 3 attempts
          if (retries > 3) {
            console.log('🔴 Redis: Max connection attempts reached. Disabling Redis.');
            return false;
          }
          return Math.min(retries * 50, 500);
        },
      },
      password: config.redis.password,
    });

    redisClient.on('error', (error) => {
      console.warn('🔴 Redis: Connection failed, falling back to in-memory cache');
      // Don't spam the console with repeated errors
      redisClient = null;
    });

    redisClient.on('connect', () => {
      console.log('🔴 Redis connected successfully');
    });

    redisClient.on('disconnect', () => {
      console.log('🔴 Redis disconnected');
    });

    // Set a timeout for connection attempt
    const connectionTimeout = setTimeout(() => {
      console.warn('🔴 Redis: Connection timeout, using in-memory cache only');
      redisClient = null;
    }, 5000);

    await redisClient.connect();
    clearTimeout(connectionTimeout);
  } catch (error) {
    console.warn('🔴 Redis: Failed to connect, using in-memory cache only');
    redisClient = null;
    // Don't throw the error - Redis is optional
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.disconnect();
      console.log('🔴 Redis connection closed');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
};
