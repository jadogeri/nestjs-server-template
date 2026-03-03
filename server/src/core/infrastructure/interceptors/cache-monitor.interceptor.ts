import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable() // Required for NestJS to recognize it
export class CacheMonitorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('CacheMonitor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const method = context.getHandler().name;

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        // In your service, you return the payload on hit, or null on miss.
        if (data) {
          this.logger.log(`[${method}] CACHE HIT - ${duration}ms`);
        } else {
          this.logger.warn(`[${method}] CACHE MISS - DB Query Triggered - ${duration}ms`);
        }
      }),
    );
  }
}
