import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { Cache } from 'cache-manager';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;

  const mockCacheManager = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    clear: jest.fn(),
    store: {
      keys: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    jest.clearAllMocks();
  });

  describe('Happy Path (6 Tests)', () => {
    it('should successfully set a value with default TTL (converted to ms)', async () => {
      await service.set('key', 'value');
      expect(cacheManager.set).toHaveBeenCalledWith('key', 'value', 3600000);
    });

    it('should successfully set a value with custom TTL', async () => {
      await service.set('key', 'value', 10);
      expect(cacheManager.set).toHaveBeenCalledWith('key', 'value', 10000);
    });

    it('should retrieve a value that exists in cache', async () => {
      mockCacheManager.get.mockResolvedValue('cached_value');
      const result = await service.get('key');
      expect(result).toBe('cached_value');
    });

    it('should delete a specific key', async () => {
      await service.delete('key');
      expect(cacheManager.del).toHaveBeenCalledWith('key');
    });

    it('should retrieve all keys from the store', async () => {
      mockCacheManager.store.keys.mockResolvedValue(['key1', 'key2']);
      const keys = await service.getAllKeys();
      expect(keys).toEqual(['key1', 'key2']);
    });

    it('should clear/reset the entire cache', async () => {
      await service.reset();
      expect(cacheManager.clear).toHaveBeenCalled();
    });
  });

  describe('Edge Cases (6 Tests)', () => {
    it('should return null when get() finds undefined (standardizing output)', async () => {
      mockCacheManager.get.mockResolvedValue(undefined);
      const result = await service.get('non_existent');
      expect(result).toBeNull();
    });

    it('should return null when get() finds null', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      const result = await service.get('key');
      expect(result).toBeNull();
    });

    it('should return empty array if store does not support keys() function', async () => {
      const limitedCache = { store: {} }; // No keys function
      const limitedService = new CacheService(limitedCache as any);
      const keys = await limitedService.getAllKeys();
      expect(keys).toEqual([]);
    });

    it('should return empty array if store is completely missing (edge case safety)', async () => {
      const noStoreCache = {}; 
      const limitedService = new CacheService(noStoreCache as any);
      const keys = await limitedService.getAllKeys();
      expect(keys).toEqual([]);
    });

    it('should handle storing complex objects correctly', async () => {
      const complexValue = { id: 1, roles: ['admin'] };
      await service.set('user', complexValue);
      expect(cacheManager.set).toHaveBeenCalledWith('user', complexValue, 3600000);
    });

    it('should propagate errors from the underlying cache manager', async () => {
      mockCacheManager.set.mockRejectedValue(new Error('Redis Down'));
      await expect(service.set('key', 'val')).rejects.toThrow('Redis Down');
    });
  });
});
