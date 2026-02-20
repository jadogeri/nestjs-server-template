import { Response } from "express";
import { UserPayload } from "../../../common/interfaces/user-payload.interface";
import { RefreshTokenPayload } from "../../../common/types/refresh-token-payload.type";
import { Service } from "../../../common/decorators/service.decorator";
import { CredentialServiceInterface } from "./interfaces/credential-service.interface";
import { randomUUID } from "node:crypto";
import { ForbiddenException, Logger, UnauthorizedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { HashingService } from "../../../core/security/hashing/interfaces/hashing.service";
import { TokenService } from "../../../core/security/token/token.service";
import { CreateSessionDto } from "../../session/dto/create-session.dto";
import { AuthRepository } from "../auth.repository";
import { SessionService } from "../../session/session.service";
import { CookieService } from "../../../core/security/cookie/cookie.service";
import { StatusEnum } from "src/common/enums/user-status.enum";
import { AccessControlService } from "src/core/security/access-control/access-control.service";
import { UserService } from "src/modules/user/user.service";
import { ConfigService } from "@nestjs/config";
import { PayloadMapperService } from "../payload-mapper.service";
import { UpdateSessionDto } from "../../../modules/session/dto/update-session.dto";
import { AccessTokenPayload } from "../../../common/types/access-token-payload.type";


@Service()
export class CredentialService implements CredentialServiceInterface {
    private readonly MAX_FAILED_LOGIN_ATTEMPTS = 4; // Example threshold
    private readonly logger = new Logger(CredentialService.name);
    constructor(
      private readonly authRepository: AuthRepository, // Also injected here
      private readonly hashingService: HashingService,
      private readonly tokenService: TokenService,   
      private readonly sessionService: SessionService, // Inject your SessionService
      private readonly cookieService: CookieService, // Inject your CookieService
      private readonly eventEmitter: EventEmitter2, // For emitting events
      private readonly accessControlService: AccessControlService, // For checking user status
      private readonly configService: ConfigService, // For accessing config values like pepper
      private readonly payloadMapperService: PayloadMapperService, // For mapping to UserPayload
      private readonly userService: UserService, // For fetching user details
    ){ }

    async login(res: Response<any, Record<string, any>>, userPayload: UserPayload): Promise<any> {
    // A. Generate a unique Session ID immediately
        const sessionId = randomUUID();
        console.log("Generated session ID:", sessionId);

        // B. Generate tokens, passing the sessionId so it can be embedded in the payload
        const data = await this.tokenService.generateAuthTokens(userPayload, sessionId); 
        
        // C. Hash the refresh token
        const hashedRefreshToken = await this.hashingService.hash(data.refreshToken);

        const auth = await this.authRepository.findOne({ where: { user: { id: userPayload.userId } } });
        if (!auth) throw new UnauthorizedException('User not found for token generation');

        // D. Create the session in DB using our pre-generated ID
        // Ensure your Session entity/DTO accepts 'id' or 'sessionId'
        const createSessionDto : CreateSessionDto = { 
            refreshTokenHash: hashedRefreshToken,
            id: sessionId, // Use the same ID for the session record
            expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Example: 7 days expiry
            auth: auth
        };
        console.log("Creating session with DTO:", createSessionDto);
        const session = await this.sessionService.create(createSessionDto);
        console.log("Created session with pre-generated ID:", session);

        // E. Set Cookie
        await this.cookieService.createRefreshToken(res, data.refreshToken);

        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            userId: userPayload.userId,
            sessionId: sessionId // Return it if needed by the client
        };  
    }
  async logout(res: Response<any, Record<string, any>>, refreshTokenPayload: RefreshTokenPayload): Promise<any> {
    const { userId, sessionId } = refreshTokenPayload;
    console.log("Attempting to refresh token for userId:", userId, "sessionId:", sessionId);
    //const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] }); 
    //create user payload from auth
    const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user', 'user.roles', 'user.roles.permissions'] });
    if (!auth?.user) {
      this.logger.warn(`Auth or User not found for userId: ${userId}`);
      throw new UnauthorizedException('User not found for token refresh');
    }
    const userPayload = this.payloadMapperService.toUserPayload(auth.user, auth.email);

    // B. Generate tokens, passing the sessionId so it can be embedded in the payload
    const data = await this.tokenService.generateAuthTokens(userPayload, sessionId); 
    
    // C. Hash the refresh token
    const hashedRefreshToken = await this.hashingService.hash(data.refreshToken);


    // D. Create the session in DB using our pre-generated ID
    // Ensure your Session entity/DTO accepts 'id' or 'sessionId'
    const updateSessionDto : UpdateSessionDto = { 
        refreshTokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Example: 7 days expiry
    };
    console.log("Creating session with DTO:", updateSessionDto);
    const session = await this.sessionService.update(sessionId, updateSessionDto);
    console.log("Created session with pre-generated ID:", session);

    // E. Set Cookie
    await this.cookieService.updateRefreshToken(res, data.refreshToken);

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: userPayload.userId,
      sessionId: sessionId // Return it if needed by the client
    };  
  }
  async refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any> { 
    const { userId, sessionId } = refreshTokenPayload;
    console.log("Attempting to refresh token for userId:", userId, "sessionId:", sessionId);
    //const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] }); 
    //create user payload from auth
    const auth = await this.authRepository.findOne({ where: { user: { id: userId } }, relations: ['user', 'user.roles', 'user.roles.permissions'] });
    if (!auth?.user) {
      this.logger.warn(`Auth or User not found for userId: ${userId}`);
      throw new UnauthorizedException('User not found for token refresh');
    }
    const userPayload = this.payloadMapperService.toUserPayload(auth.user, auth.email);

    // B. Generate tokens, passing the sessionId so it can be embedded in the payload
    const data = await this.tokenService.generateAuthTokens(userPayload, sessionId); 
    
    // C. Hash the refresh token
    const hashedRefreshToken = await this.hashingService.hash(data.refreshToken);


    // D. Create the session in DB using our pre-generated ID
    // Ensure your Session entity/DTO accepts 'id' or 'sessionId'
    const updateSessionDto : UpdateSessionDto = { 
        refreshTokenHash: hashedRefreshToken,
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Example: 7 days expiry
    };
    console.log("Creating session with DTO:", updateSessionDto);
    const session = await this.sessionService.update(sessionId, updateSessionDto);
    console.log("Created session with pre-generated ID:", session);

    // E. Set Cookie
    await this.cookieService.updateRefreshToken(res, data.refreshToken);

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: userPayload.userId,
      sessionId: sessionId // Return it if needed by the client
    };  
  }

}
