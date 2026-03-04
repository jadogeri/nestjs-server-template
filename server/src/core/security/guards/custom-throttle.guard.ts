import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerData: any,
  ): Promise<void> {
    const response = context.switchToHttp().getResponse();
    
    // 1. Calculate wait time
    const waitTimeSeconds = Math.ceil(throttlerData.timeToExpire / 1000);

    console.log("throttlerData:", throttlerData);
    console.log("Calculated wait time (seconds):", waitTimeSeconds);
    
    // 2. Set the standard HTTP Header
    response.header('Retry-After', waitTimeSeconds);

  // 3. DEFENSIVE NAME LOOKUP
    // Check if options is an array (v5) or has a throttlers property (v6)
    const configs = Array.isArray(this.options) ? this.options : (this.options as any).throttlers;
    
    // Find the config that matches the limit/ttl from the error
    const throttlerConfig = configs?.find(
      (t: any) => t.limit === throttlerData.limit && t.ttl === throttlerData.ttl
    );

  const limitName = throttlerConfig?.name || 'default';
    
    // 3. Throw the custom message including the limit name
    throw new ThrottlerException(
      `Too many requests on the '${limitName}' limit. Please try again in ${waitTimeSeconds} second(s).`
    );
  }
}
