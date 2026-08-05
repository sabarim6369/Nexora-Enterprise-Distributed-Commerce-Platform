import { Injectable, Logger, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject('REDIS_CLIENT') private redisClient: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error getting cache for key ${key}: ${errorMessage}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.redisClient.setex(key, ttl, serialized);
      } else {
        await this.redisClient.set(key, serialized);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error setting cache for key ${key}: ${errorMessage}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error deleting cache for key ${key}: ${errorMessage}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys && keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error deleting cache pattern ${pattern}: ${errorMessage}`);
    }
  }

  async reset(): Promise<void> {
    try {
      await this.redisClient.flushdb();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error resetting cache: ${errorMessage}`);
    }
  }

  generateProductKey(productId: string): string {
    return `product:${productId}`;
  }

  generateProductsListKey(filters: any): string {
    const filterString = JSON.stringify(filters);
    return `products:list:${Buffer.from(filterString).toString('base64')}`;
  }

  generateCategoryKey(categoryId: string): string {
    return `category:${categoryId}`;
  }

  generateCategoriesListKey(): string {
    return 'categories:list';
  }
}
