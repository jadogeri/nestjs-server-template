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
import { Profile } from '../profile/entities/profile.entity';
import { User } from '../user/entities/user.entity';

import { RegisterDto } from './dto/register.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

// 6. Custom Decorators (Documentation/Metatdata)
import { Service } from '../../common/decorators/service.decorator';

// . Interfaces (Data Layer)
import { VerificationEmailContext } from '../../core/infrastructure/mail/interfaces/mail-context.interface';
import { VerificationTokenPayload } from '../../common/types/verification-token-payload.type';
import { AuthNotFoundException } from '../../common/exceptions/auth-not-found.exception';
import { UserPayload } from '../../common/interfaces/user-payload.interface';
import { PayloadMapperService } from './payload-mapper.service';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { AccessTokenPayload } from 'src/common/types/access-token-payload.type';
import { FindOneOptions } from 'typeorm';
import { is } from 'date-fns/locale';
import { RefreshTokenPayload } from 'src/common/types/refresh-token-payload.type';
import { CreateSessionDto } from '../session/dto/create-session.dto';
import { UpdateSessionDto } from '../session/dto/update-session.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegistrationServiceInterface } from './services/interfaces/registration-service.interface';
import { CredentialServiceInterface } from './services/interfaces/credential-service.interface';
import { AccountManagementServiceInterface } from './services/interfaces/account-management-service.interface';
import { PasswordManagementServiceInterface } from './services/interfaces/password-management-service.interface';
import { ProfilePayload } from 'src/common/interfaces/profile-payload.interface';
import { StatusEnum } from 'src/common/enums/user-status.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';


@Service()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_FAILED_LOGIN_ATTEMPTS = 4; // Example threshold for locking accounts

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

  /*
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


      // 2. Account Status Checks (Business Logic)
      // if (!this.accessControlService.isUserActive(auth)) throw new ForbiddenException('Account is disabled'); 

      // if (!this.accessControlService.isUserVerified(auth))  throw new ForbiddenException('Account not verified');
      // 3. Fetch Full Data & Map to Payload
      const user = await this.userService.findOne({ where: { id: auth.user.id }, relations: ['roles', 'roles.permissions'] });
      if (!user) throw new UnauthorizedException('User profile not found');

      return this.payloadMapperService.toUserPayload(user, email);

  }

  */

  async verifyAccessToken(accessTokenPayload: AccessTokenPayload): Promise<AccessTokenPayload | null> {
  const { userId, email } = accessTokenPayload;

    const auth = await this.findOne({ where: { email: email }, relations: ['user', 'user.roles', 'user.roles.permissions'] });
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

  async findOne(options: FindOneOptions<Auth>): Promise<Auth | null> {    
    return await this.authRepository.findOne(options);
  }

  async findById(id: number): Promise<Auth | null> {    
    return await this.authRepository.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
  }

  public getCredentialService(): CredentialServiceInterface {
    return this.credentialService;
  }

  public getPasswordManagementService(): PasswordManagementServiceInterface {
    return this.passwordManagementService;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.passwordManagementService.forgotPassword(forgotPasswordDto.email);
  }
  
}
