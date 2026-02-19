// 1. NestJS & Third-Party Libs
import { BadRequestException, ForbiddenException, GoneException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { randomUUID } from 'node:crypto';

// 2. Services (Logic Layer)
import { AccessControlService } from '../../core/security/access-control/access-control.service';
import { CookieService } from '../../core/security/cookie/cookie.service';
import { HashingService } from '../../core/security/hashing/interfaces/hashing.service';
import { MailService } from '../../core/infrastructure/mail/mail.service';
import { SessionService } from '../session/session.service';
import { TokenService } from '../../core/security/token/token.service';
import { UserService } from '../user/user.service';

// 3. Repositories (Data Layer)
import { AuthRepository } from './auth.repository';

// 5. DTOs & Entities (Data Layer)
import { Auth } from './entities/auth.entity';

import { RegisterDto } from './dto/register.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

// 6. Custom Decorators (Documentation/Metatdata)
import { Service } from '../../common/decorators/service.decorator';

// . Interfaces (Data Layer)
import { UserPayload } from '../../common/interfaces/user-payload.interface';
import { PayloadMapperService } from './payload-mapper.service';
import { Request, Response } from 'express';
import { FindOneOptions } from 'typeorm';
import { RefreshTokenPayload } from 'src/common/types/refresh-token-payload.type';
import { CreateSessionDto } from '../session/dto/create-session.dto';
import { UpdateSessionDto } from '../session/dto/update-session.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegistrationServiceInterface } from './services/interfaces/registration-service.interface';
import { CredentialServiceInterface } from './services/interfaces/credential-service.interface';
import { AccountManagementServiceInterface } from './services/interfaces/account-management-service.interface';
import { PasswordManagementServiceInterface } from './services/interfaces/password-management-service.interface';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IdentityServiceInterface } from './services/interfaces/identity-service.interface';


@Service()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly registrationSercive: RegistrationServiceInterface, 
    private readonly credentialService: CredentialServiceInterface,
    private readonly session: SessionService,
    private readonly passwordManagementService: PasswordManagementServiceInterface,
    private readonly account: AccountManagementServiceInterface,
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService, 
    private readonly configService: ConfigService,
    private readonly accessControlService: AccessControlService,
    private readonly userService: UserService,
    private readonly payloadMapperService: PayloadMapperService,
    private readonly sessionService: SessionService,
    private readonly cookieService: CookieService,
    private readonly eventEmitter: EventEmitter2,
    private readonly identityService: IdentityServiceInterface
  ) {}

  async register(registerDto: RegisterDto) {

    return await this.registrationSercive.register(registerDto);

  }

  async verifyEmail(token: string) {
    
    return await this.registrationSercive.verifyEmail(token);

  }

  async resendVerification(email: string) {

    return await this.registrationSercive.resendVerification(email);
  
  }

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
    };  }

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


  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.create(createAuthDto);
  }

  async findAll() {
    return await this.authRepository.findAll({});
  }


  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.authRepository.update(id, updateAuthDto);
  }

  async remove(id: number) {
    return await this.authRepository.delete(id);
  }

  async findOne(options: FindOneOptions<Auth>): Promise<Auth | null> {    
    return await this.authRepository.findOne(options);
  }

  async findById(id: number): Promise<Auth | null> {    
    return await this.authRepository.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    return this.passwordManagementService.forgotPassword(forgotPasswordDto.email);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.passwordManagementService.resetPassword(resetPasswordDto); 
  }

  public getCredentialService(): CredentialServiceInterface {
    return this.credentialService;
  }

  public getPasswordManagementService(): PasswordManagementServiceInterface {
    return this.passwordManagementService;
  }

  public getIdentityService(): IdentityServiceInterface {
    return this.identityService;
  }
  
}
