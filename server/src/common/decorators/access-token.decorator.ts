
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../types/access-token-payload.type';

export const AccessToken = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Logic: Look at .user, but your code treats it as the JWT payload
    const payload = request.user; 
    return data ? payload?.[data]  : payload as AccessTokenPayload;
  },
);
