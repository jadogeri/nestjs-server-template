import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  // NestJS automatically handles connection/disconnection via AppContext
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    // Note: cache-manager uses milliseconds or seconds depending on version
    // NestJS v4+ / cache-manager v5 uses milliseconds
    await this.cacheManager.set(key, value, ttl * 1000); 
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    // Convert undefined to null to satisfy your type T | null
    return result ?? null;
  }

  async getAllKeys(): Promise<string[]> {
    const store = (this.cacheManager as any).store;
    if (store && typeof store.keys === 'function') {
        return await store.keys();
    }
    return [];
}

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
  }
}
