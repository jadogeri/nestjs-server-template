// src/auth/token/token.service.ts
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Service } from '../../../common/decorators/service.decorator';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { JwtPayloadInterface } from 'src/common/interfaces/jwt-payload.interface';
import { VerificationTokenPayload } from 'src/common/types/verification-token-payload.type';


@Service()
export class TokenService {
  constructor(
    @Inject('ACCESS_TOKEN_JWT_SERVICE') private readonly accessJwtService: JwtService,
    @Inject('REFRESH_TOKEN_JWT_SERVICE') private readonly refreshJwtService: JwtService,
    @Inject('VERIFY_TOKEN_JWT_SERVICE') private readonly verifyJwtService: JwtService,
  ) {}

  async generateAuthTokens(user: UserPayload, sessionId: string) {
    console.log("Generating auth tokens for user:", user);
    const jwtPayload: JwtPayloadInterface = {
      userId: user.userId,
      sub: user.userId, // Standard JWT subject claim
      permissions: user.permissions,
      email: user.email,  
      roles: user.roles,
      type: 'access', // Custom claim to identify token type
    }

    // Secrets and expiration are already baked into the services
    const [accessToken, refreshToken] = await Promise.all([
      this.accessJwtService.signAsync(jwtPayload),
      this.refreshJwtService.signAsync({ userId: user.userId, type: 'refresh', sessionId: sessionId }) // Minimal payload for refresh token, include sessionId
    ]);

    return { accessToken, refreshToken };
  }

  async generateVerificationToken(verificationTokenPayload: VerificationTokenPayload) {
    
    const verificationToken = await this.verifyJwtService.signAsync(verificationTokenPayload);
    return verificationToken;
  }

  async verifyEmailToken(token: string) : Promise<VerificationTokenPayload> {
    // 3. This will use the verification-specific secret and expiration
    return await this.verifyJwtService.verifyAsync(token);
  }


  /**
   * Decodes a token WITHOUT verifying the signature (fast, but untrusted)
   */
  async decodeRefreshToken(token: string) {
    return await this.refreshJwtService.verifyAsync(token, { ignoreExpiration: false });
  }

  async verifyRefreshToken(token: string) {
    // Uses the refresh-specific service configuration
    return this.refreshJwtService.verifyAsync(token);
  }

  /**
   * Verifies AND Decodes (Safe for server-side logic)
   */
  async verifyAccessToken(token: string) {
    try {
      return await this.accessJwtService.verifyAsync(token);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Access token verification failed:', e.message);
      }
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
  
}
