// src/common/cache/cache-config.module.ts
import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Global() // Makes CacheService and CACHE_MANAGER available everywhere
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            // Use 'redis' because that is the service name in your docker-compose
            host: configService.get('REDIS_HOST') || (configService.get('NODE_ENV') === 'production' ? 'redis' : 'localhost'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
            
          },
          ttl: 30000, // 30 seconds default
        }),
      }),
      isGlobal: true, // Makes CacheManager available everywhere
    }),
  ],
  providers: [CacheService],
  exports: [CacheService], // Export so other services can use your wrapper
})

export class CacheConfigModule {}
