import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Interceptor } from '../../../common/decorators/interceptor.decorator';

@Interceptor()
export class CacheMonitorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('CacheMonitor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = context.getHandler().name;

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        
        // If data is returned from your service's cached logic
        if (data) {
          this.logger.log(`[${method}] CACHE HIT - Duration: ${duration}ms`);
        } else {
          // If the service returns null, it's a miss that hit the DB
          this.logger.warn(`[${method}] CACHE MISS - DB query triggered - Duration: ${duration}ms`);
        }
      }),
    );
  }
}
