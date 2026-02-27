import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccessControlService } from 'src/core/security/access-control/access-control.service';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from '../auth.service';


import { RefreshTokenPayload } from 'src/common/types/refresh-token-payload.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {

    private readonly logger = new Logger(RefreshTokenStrategy.name);  
    constructor(
      @Inject(ConfigService) private readonly configService: ConfigService,
      private readonly authService: AuthService,
      private readonly userService: UserService,
      private readonly accessControlService: AccessControlService
    ) {
    super({
      // 1. Where to find the token -- in this case, from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        // Optional: Keep this if you want to support both headers and cookies
        ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ]),
      // 2. Secret key used to sign the token
      secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'), 
      ignoreExpiration: false,
    });
  }


  async validate(refreshTokenPayload: RefreshTokenPayload): Promise<RefreshTokenPayload | null> {
    this.logger.log(`Validating user in RefreshTokenStrategy using extracted payload: `);
    this.logger.debug(refreshTokenPayload);

    const jwtUser = await this.authService.getIdentityService().verifyRefreshToken(refreshTokenPayload);
    if (!jwtUser) {
      this.logger.warn(`JWT validation failed for refresh token: ${JSON.stringify(refreshTokenPayload)}`);
      return null;
    }
    console.log("Refresh token validated successfully, payload:", jwtUser);

    return jwtUser;
  }


}

  const cookieExtractor = (req: Request): string | null => {
    let token = null;
    if (req?.cookies) {
      token = req.cookies['refreshToken']; // Use the exact name of your cookie
    }
    return token;
  };