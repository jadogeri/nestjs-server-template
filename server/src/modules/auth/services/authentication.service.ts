import { Response } from "express";
import { UserPayload } from "../../../common/interfaces/user-payload.interface";
import { RefreshTokenPayload } from "../../../common/types/refresh-token-payload.type";
import { Service } from "../../../common/decorators/service.decorator";
import { AuthenticationServiceInterface } from "./interfaces/authentication-service.interface";
import { randomUUID } from "node:crypto";
import { ForbiddenException, Logger, UnauthorizedException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { HashingService } from "../../../core/security/hashing/interfaces/hashing.service";
import { TokenService } from "../../../core/security/token/token.service";
import { CreateSessionDto } from "../../../modules/session/dto/create-session.dto";
import { AuthRepository } from "../auth.repository";
import { SessionService } from "../../../modules/session/session.service";
import { CookieService } from "../../../core/security/cookie/cookie.service";
import { StatusEnum } from "src/common/enums/user-status.enum";
import { AccessControlService } from "src/core/security/access-control/access-control.service";
import { UserService } from "src/modules/user/user.service";
import { ConfigService } from "@nestjs/config";
import { PayloadMapperService } from "../payload-mapper.service";


@Service()
export class AuthenticationService implements AuthenticationServiceInterface {
    private readonly MAX_FAILED_LOGIN_ATTEMPTS = 4; // Example threshold
    private readonly logger = new Logger(AuthenticationService.name);
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
    logout(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any> {
        throw new Error("Method not implemented.");
    }     


  async verifyUser(email: string, password: string): Promise<UserPayload | null> {
      const auth = await this.authRepository.findByEmail(email);
      if (!auth) throw new UnauthorizedException('Invalid credentials provided - auth record not found');  
      console.log("auth record found for email:", auth);

      const isVerified = this.accessControlService.isUserVerified(auth);
      if (!isVerified) throw new ForbiddenException('Account not verified, please verify your email before logging in');
      if (auth.status === StatusEnum.LOCKED) throw new ForbiddenException('Account is locked, use forget account to access account');
      
      const isMatch = await this.hashingService.compare(password, auth.password);
      if (!isMatch) {
        auth.failedLoginAttempts = auth.failedLoginAttempts + 1;
        if(auth.failedLoginAttempts >= this.MAX_FAILED_LOGIN_ATTEMPTS){
          auth.status = StatusEnum.LOCKED;
          auth.isEnabled = false; 
          await this.authRepository.update(auth.id, auth);

          //sendEmail("locked-account",recipient )
           this.eventEmitter.emit('account.locked', auth);


          this.logger.warn(`Account is locked due to too many failed login attempts. Use forget account to access account: ${email}`);
          throw new ForbiddenException('Account is locked due to too many failed login attempts. Use forget account to access account');

        }else{
          await this.authRepository.update(auth.id, { failedLoginAttempts: auth.failedLoginAttempts });
          throw new UnauthorizedException('Invalid credentials provided - password mismatch');

        }

      }


      // ALWAYS use the service so the pepper logic stays identical
      console.log(`Verifying user with email: ${email}`);
      console.log("password provided:", password);
      console.log("stored password hash:", auth.password);
      const pepper = this.configService.get<string>('HASH_PEPPER') || '';
      console.log("Using pepper:", pepper ? 'Yes' : 'No');

      const user = await this.userService.findOne({ where: { id: auth.user.id }, relations: ['roles', 'roles.permissions'] });
      if (!user) throw new UnauthorizedException('User profile not found');

      return this.payloadMapperService.toUserPayload(user, email);

  }


}
