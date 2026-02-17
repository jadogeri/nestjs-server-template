import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RefreshTokenPayload } from "../types/refresh-token-payload.type";

export const RefreshToken = createParamDecorator(
  (data: keyof RefreshTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Passport populates request.user with the object returned from validate()
    const user = request.user; 

    return data ? user?.[data] : user as RefreshTokenPayload;
  },
);
