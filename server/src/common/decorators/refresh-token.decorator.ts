
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshTokenPayload } from '../types/refresh-token-payload.type';

export const RefreshToken = createParamDecorator(
  (data: keyof RefreshTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Logic: Look at .user, but your code treats it as the JWT payload

    const cookies = request.cookies;
    const token = cookies?.['refreshToken'];
    
    return data ? token?.[data] : token as RefreshTokenPayload;
  },
);


