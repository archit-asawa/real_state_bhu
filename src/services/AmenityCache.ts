import NodeCache from 'node-cache';
import { getRedisClient } from '../config/redis';
import { config } from '../config/environment';
import { AmenityType, NearbyAmenity } from '../types';

export class AmenityCache {
  private nodeCache: NodeCache;
  private redisClient = getRedisClient();

  constructor() {
    // Fallback to in-memory cache if Redis is not available
    this.nodeCache = new NodeCache({
      stdTTL: config.cache.amenityTtl,
      checkperiod: 600, // Check for expired keys every 10 minutes
      useClones: false,
    });
  }

  private generateKey(propertyId: string, amenityType: AmenityType, radius: number = 5000): string {
    return `amenity:${propertyId}:${amenityType}:${radius}`;
  }

  async get(
    propertyId: string, 
    amenityType: AmenityType, 
    radius: number = 5000
  ): Promise<NearbyAmenity[] | null> {
    const key = this.generateKey(propertyId, amenityType, radius);

    try {
      // Try Redis first
      if (this.redisClient) {
        const cached = await this.redisClient.get(key);
        if (cached) {
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.warn('Redis get error:', error);
    }

    // Fall back to in-memory cache
    const cached = this.nodeCache.get<NearbyAmenity[]>(key);
    return cached || null;
  }

  async set(
    propertyId: string, 
    amenityType: AmenityType, 
    data: NearbyAmenity[], 
    ttl: number = config.cache.amenityTtl,
    radius: number = 5000
  ): Promise<void> {
    const key = this.generateKey(propertyId, amenityType, radius);

    try {
      // Try Redis first
      if (this.redisClient) {
        await this.redisClient.setEx(key, ttl, JSON.stringify(data));
      }
    } catch (error) {
      console.warn('Redis set error:', error);
    }

    // Always set in memory cache as fallback
    this.nodeCache.set(key, data, ttl);
  }

  async invalidate(propertyId: string): Promise<void> {
    const pattern = `amenity:${propertyId}:*`;

    try {
      // Clear from Redis
      if (this.redisClient) {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }
    } catch (error) {
      console.warn('Redis invalidate error:', error);
    }

    // Clear from in-memory cache
    const keys = this.nodeCache.keys();
    const keysToDelete = keys.filter(key => key.startsWith(`amenity:${propertyId}:`));
    this.nodeCache.del(keysToDelete);
  }

  async clear(): Promise<void> {
    try {
      // Clear from Redis
      if (this.redisClient) {
        const keys = await this.redisClient.keys('amenity:*');
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }
    } catch (error) {
      console.warn('Redis clear error:', error);
    }

    // Clear in-memory cache
    this.nodeCache.flushAll();
  }

  getStats(): { redis: boolean; memoryKeys: number } {
    return {
      redis: !!this.redisClient,
      memoryKeys: this.nodeCache.keys().length,
    };
  }
}

// Singleton instance
export const amenityCache = new AmenityCache();
