import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  // This is the primary method to bypass throttling
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Bypass throttling for the /admin route and its static assets
    if (request.url.startsWith('/admin')) {
      return true;
    }

    return super.shouldSkip(context);
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerData: any, // Contains: limit, ttl, timeToExpire, etc.
  ): Promise<void> {
    const response = context.switchToHttp().getResponse();
    
    // Convert ms to seconds for the Retry-After header
    const waitTimeSeconds = Math.ceil(throttlerData.timeToExpire / 1000);
    
    // Set the standard HTTP Header
    response.header('Retry-After', waitTimeSeconds);

    // Identify which limit was hit (if you have multiple named throttlers)
    const limitName = throttlerData.throttler?.name || 'default';
    
    throw new ThrottlerException(
      `Too many requests on the '${limitName}' limit. Please try again in ${waitTimeSeconds} second(s).`
    );
  }
}
