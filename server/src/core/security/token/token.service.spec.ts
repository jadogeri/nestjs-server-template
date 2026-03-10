import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserPayload } from '../../../common/interfaces/user-payload.interface';

describe('TokenService', () => {
  let service: TokenService;
  let accessJwtService: JwtService;
  let refreshJwtService: JwtService;
  let verifyJwtService: JwtService;

  const mockUser: UserPayload = {
    userId: 1,
    email: 'dev@example.com',
    roles: ['ADMIN'],
    permissions: ['profile:read', 'profile:update'], // action:resource format
  };

  const mockSessionId = 'uuid-session-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: 'ACCESS_TOKEN_JWT_SERVICE',
          useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() },
        },
        {
          provide: 'REFRESH_TOKEN_JWT_SERVICE',
          useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() },
        },
        {
          provide: 'VERIFY_TOKEN_JWT_SERVICE',
          useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    accessJwtService = module.get('ACCESS_TOKEN_JWT_SERVICE');
    refreshJwtService = module.get('REFRESH_TOKEN_JWT_SERVICE');
    verifyJwtService = module.get('VERIFY_TOKEN_JWT_SERVICE');
  });

  describe('Happy Path Tests', () => {
    it('1. should generate both access and refresh tokens', async () => {
      jest.spyOn(accessJwtService, 'signAsync').mockResolvedValue('access-token-string');
      jest.spyOn(refreshJwtService, 'signAsync').mockResolvedValue('refresh-token-string');

      const result = await service.generateAuthTokens(mockUser, mockSessionId);

      expect(result).toEqual({
        accessToken: 'access-token-string',
        refreshToken: 'refresh-token-string',
      });
    });

    it('2. should include numeric userId and action:resource permissions in access payload', async () => {
      const signSpy = jest.spyOn(accessJwtService, 'signAsync');
      await service.generateAuthTokens(mockUser, mockSessionId);

      expect(signSpy).toHaveBeenCalledWith(expect.objectContaining({
        userId: 1,
        permissions: ['profile:read', 'profile:update'],
        type: 'access',
      }));
    });

    it('3. should include sessionId in refresh token payload', async () => {
      const signSpy = jest.spyOn(refreshJwtService, 'signAsync');
      await service.generateAuthTokens(mockUser, mockSessionId);

      expect(signSpy).toHaveBeenCalledWith(expect.objectContaining({
        sessionId: mockSessionId,
        type: 'refresh',
      }));
    });

    it('4. should sign a verification token with provided payload', async () => {
      const vPayload = { userId: 1, type: "access" as const, email: 'dev@example.com' };
      jest.spyOn(verifyJwtService, 'signAsync').mockResolvedValue('v-token');

      const result = await service.generateVerificationToken(vPayload);
      expect(result).toBe('v-token');
      expect(verifyJwtService.signAsync).toHaveBeenCalledWith(vPayload);
    });

    it('5. should verify and return a valid access token payload', async () => {
      const decoded = { userId: 1, roles: ['USER'] };
      jest.spyOn(accessJwtService, 'verifyAsync').mockResolvedValue(decoded);

      const result = await service.verifyAccessToken('valid-jwt');
      expect(result).toEqual(decoded);
    });

    it('6. should verify email verification tokens using verifyJwtService', async () => {
      const decoded = { email: 'dev@example.com' };
      jest.spyOn(verifyJwtService, 'verifyAsync').mockResolvedValue(decoded);

      const result = await service.verifyEmailToken('v-jwt');
      expect(result).toEqual(decoded);
    });
  });

  describe('Edge Case Tests', () => {
    it('7. should throw UnauthorizedException when access token is expired', async () => {
      jest.spyOn(accessJwtService, 'verifyAsync').mockRejectedValue(new Error('TokenExpiredError'));

      await expect(service.verifyAccessToken('expired-jwt'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('8. should throw UnauthorizedException for tokens with invalid signatures', async () => {
      jest.spyOn(accessJwtService, 'verifyAsync').mockRejectedValue(new Error('JsonWebTokenError'));

      await expect(service.verifyAccessToken('tampered-jwt'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('9. should handle users with empty permission arrays', async () => {
      const guestUser: UserPayload = { ...mockUser, permissions: [] };
      jest.spyOn(accessJwtService, 'signAsync').mockResolvedValue('token');
      jest.spyOn(refreshJwtService, 'signAsync').mockResolvedValue('token');

      const result = await service.generateAuthTokens(guestUser, 'sid');
      expect(result.accessToken).toBeDefined();
    });

    it('10. should enforce expiration check when decoding refresh tokens', async () => {
      const verifySpy = jest.spyOn(refreshJwtService, 'verifyAsync').mockRejectedValue(new Error('expired'));

      await expect(service.decodeRefreshToken('expired-refresh')).rejects.toThrow();
      expect(verifySpy).toHaveBeenCalledWith(expect.any(String), { ignoreExpiration: false });
    });

    it('11. should isolate services (verifyRefreshToken should not call accessJwtService)', async () => {
      jest.spyOn(refreshJwtService, 'verifyAsync').mockResolvedValue({ userId: 1 });
      const accessSpy = jest.spyOn(accessJwtService, 'verifyAsync');

      await service.verifyRefreshToken('refresh-jwt');
      expect(accessSpy).not.toHaveBeenCalled();
    });

    it('12. should propagate unexpected errors from the signing library', async () => {
      jest.spyOn(accessJwtService, 'signAsync').mockRejectedValue(new Error('Internal Cryptographic Failure'));

      await expect(service.generateAuthTokens(mockUser, 'sid'))
        .rejects
        .toThrow('Internal Cryptographic Failure');
    });
  });
});
