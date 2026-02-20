import { UnauthorizedException, ForbiddenException, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { StatusEnum } from "src/common/enums/user-status.enum";
import { HashingService } from "src/core/security/hashing/interfaces/hashing.service";
import { TokenService } from "src/core/security/token/token.service";
import { Service } from "../../../common/decorators/service.decorator";
import { AuthRepository } from "../auth.repository";
import { PasswordManagementServiceInterface } from "./interfaces/password-management-service.interface";
import { AccessControlService } from "src/core/security/access-control/access-control.service";
import { PasswordGeneratorUtil } from "src/common/utils/password-generator.util";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { IdentityServiceInterface } from "./interfaces/identity-service.interface";
import { AccessTokenPayload } from "src/common/types/access-token-payload.type";
import { RefreshTokenPayload } from "../../../common/types/refresh-token-payload.type";
import { UserService } from "../../../modules/user/user.service";
import { SessionService } from "../../../modules/session/session.service";
import { UserPayload } from "src/common/interfaces/user-payload.interface";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { PayloadMapperService } from "../payload-mapper.service";

@Service()
export class IdentityService implements IdentityServiceInterface {

    private logger = new Logger(IdentityService.name);
    private readonly MAX_FAILED_LOGIN_ATTEMPTS = 4;

      
      constructor(
          private readonly authRepository: AuthRepository, // Also injected here
          private readonly hashingService: HashingService,
          private readonly tokenService: TokenService,   
          private readonly eventEmitter: EventEmitter2, // For emitting events
          private readonly accessControlService: AccessControlService, // For checking user status
          private readonly userService: UserService,
          private readonly sessionService: SessionService,
          private readonly configService: ConfigService,
          private readonly payloadMapperService: PayloadMapperService
      ) { 
      }
  async verifyUser(email: string, password: string): Promise< UserPayload | null> {
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
      if (auth.failedLoginAttempts > 0) {
        await this.authRepository.update(auth.id, { failedLoginAttempts: 0 });
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

  async verifyAccessToken(accessTokenPayload: AccessTokenPayload): Promise<AccessTokenPayload | null> {
  const { userId, email } = accessTokenPayload;

    const auth = await this.authRepository.findOne({ where: { email: email }, relations: ['user', 'user.roles', 'user.roles.permissions'] });
    console.log("AuthService: Verifying access token for email:", email);
    if (!auth)  return null;
   //  account status checks
    if (!this.accessControlService.isUserActive(auth)) {
      this.logger.warn(`Account for email ${email} is disabled.`);
      return null;

    }

    this.logger.log(`Account for email ${email} is active.`);

    const user = await this.userService.findById(userId);
    if (!user){
      this.logger.warn(`User not found with id: ${userId}`);
      return null;
    }
    console.log("auth ==> ", auth);
    if (auth.user.id !== userId) {
      this.logger.warn(`User ID mismatch: token has ${userId} but auth record has ${auth.user.id}`);
      return null;
    }
    console.log("JwtStrategy: Retrieved user from database:", accessTokenPayload.email);

    return accessTokenPayload;
}
  async verifyRefreshToken(refreshTokenPayload: RefreshTokenPayload): Promise<RefreshTokenPayload | null> {
    const { userId, sessionId} = refreshTokenPayload;
    const auth  = await this.authRepository.findOne({ where: { user: { id: userId } } , relations: ['user'] });
    const session = await this.sessionService.findOne(sessionId);
    console.log("seesionId from token:", sessionId);
    console.log("session ==> ", session);
    console.log("AuthService: Verifying refresh token for user ID:", JSON.stringify(auth, null,4));
    if (!auth) throw new UnauthorizedException('User not found for this token');
    if (auth.user.id !== userId) throw new UnauthorizedException('Token user ID does not match auth record');
    if (!session) throw new UnauthorizedException('Session not found for this token');
    if (session.auth.id !== auth.id) throw new UnauthorizedException('Session does not belong to the user');
    if (session.expiresAt < new Date()) throw new UnauthorizedException('Session has expired');

    const isUserActive = this.accessControlService.isUserActive(auth);
    if (!isUserActive) {
        this.logger.warn(`Account for user ID ${userId} is disabled.`);
        return null;  
    }

        this.logger.log(`Account for email ${auth.email} is active.`);

        const user = await this.userService.findById(userId);
        if (!user){
        this.logger.warn(`User not found with id: ${userId}`);
        return null;
        }
        console.log("auth ==> ", auth);
        if (auth.user.id !== userId) {
        this.logger.warn(`User ID mismatch: token has ${userId} but auth record has ${auth.user.id}`);
        return null;
        }
        console.log("refresh token: Retrieved user from database:", refreshTokenPayload);

        return refreshTokenPayload;
    }

}