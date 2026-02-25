import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<ExpressResponse>();

        // Check if data is an array or has a count property
        // This logic assumes your service returns [items, totalCount] 
        // or just the items array
        if (Array.isArray(data)) {
          response.setHeader('X-Total-Count', data.length);
          response.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        } else if (data && data.items && typeof data.total !== 'undefined') {
          // If you return an object like { items: [], total: 100 }
          response.setHeader('X-Total-Count', data.total);
          response.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
          return data.items;
        }

        return data;
      }),
    );
  }
}
