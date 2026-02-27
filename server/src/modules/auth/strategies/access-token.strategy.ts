import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { AccessControlService } from 'src/core/security/access-control/access-control.service';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from '../auth.service';
import { PermissionString } from 'src/common/types/permission-string.type';
import { UserRole } from 'src/common/types/user-role.type';
import { PermissionStringGeneratorUtil } from 'src/common/utils/permission-string.util';
import { JwtPayloadInterface } from 'src/common/interfaces/jwt-payload.interface';
import { AccessTokenPayload } from 'src/common/types/access-token-payload.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {

    private readonly logger = new Logger(AccessTokenStrategy.name);  
    constructor(
      @Inject(ConfigService) private readonly configService: ConfigService,
      private readonly authService: AuthService,
      private readonly userService: UserService,
      private readonly accessControlService: AccessControlService
    ) {
    super({
      // 1. Where to find the token -- in this case, from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      // 2. Secret key used to sign the token
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'), 
      ignoreExpiration: false,
    });
  }


  async validate(accessTokenPayload: AccessTokenPayload): Promise<AccessTokenPayload | null> {
    this.logger.log(`Validating user in JwtStrategy using extrated payload: `);
    this.logger.debug(accessTokenPayload);

    const jwtUser = await this.authService.getIdentityService().verifyAccessToken(accessTokenPayload);
    if (!jwtUser) {
      this.logger.warn(`JWT validation failed for email: ${accessTokenPayload.email}`);
      return null;
    }

    return jwtUser;
  }
}

