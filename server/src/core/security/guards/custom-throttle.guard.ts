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
    
    // 2. Set the standard HTTP Header
    response.header('Retry-After', waitTimeSeconds);
    
    // 3. Throw the custom message including the limit name
    throw new ThrottlerException(
      `Too many requests on the '${throttlerData.name}' limit. Please try again in ${waitTimeSeconds} second(s).`
    );
  }
}
