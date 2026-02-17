// 1. NestJS & Third-Party Libs
import { BadRequestException, ConflictException, ForbiddenException, GoneException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { randomUUID } from 'node:crypto';
import { TokenExpiredError } from '@nestjs/jwt/dist';



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

// 4. Utilities & Helpers (Logic Layer)
import { AuthGeneratorUtil } from '../../common/utils/auth-generator.util';
import { ProfileGeneratorUtil } from '../../common/utils/profile-generator.util';
import { UserGeneratorUtil } from '../../common/utils/user-generator.util';

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
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
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


@Service()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);g

  constructor(
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
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, dateOfBirth } = registerDto;
    
    try{
      const existingAuth = await this.authRepository.findOne({ where: { email } });
      if (existingAuth) {
        throw new ConflictException(`Email address "${email}" has already been registered.`);
      }
      const userPayload : User = UserGeneratorUtil.generate({ firstName, lastName, dateOfBirth });
      const hashedPassword = await this.hashingService.hash(password);    
      const authPayload : Auth = AuthGeneratorUtil.generate({ email, password: hashedPassword });
      authPayload.user = userPayload; // Cascading will handle the user creation

      const profilePayload: Profile = ProfileGeneratorUtil.generate({}); // You can pass necessary data if needed
      userPayload.profile = profilePayload; // Assign the profile to the user

      const savedAuth = await this.authRepository.create(authPayload);  
      
      const auth =  await this.authRepository.findOne({
        where: { id: savedAuth.id }, relations: ['user' , 'user.roles'] 
      });

      if (!auth?.user) throw new NotFoundException('User account creation failed.');

      // CALL THE HELPER
      await this.sendVerificationProcess(auth);
      const result = { message: 'Registration successful! Please check your email to verify your account.' };
      return result;

    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        this.logger.error('Error verifying email token:', error.message);
        throw new GoneException('Verification link expired. Please request a new one.');

      }
      this.logger.error('Error verifying email token:', error instanceof Error ? error.message : error);
      throw new BadRequestException('Invalid verification token.');
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = await this.tokenService.verifyEmailToken(token);
      console.log('Email verification token payload:', payload);
      const{ userId, email } = payload;
      const userAccount = await this.authRepository.findOne({ where: { user: { id: userId }, email }, relations: ['user'] });
      if (!userAccount) {
        throw new UserNotFoundException("No user account found for this verification token.");
      }
      if (userAccount.isVerified) {
        throw new ConflictException({ 
          message: 'Your email is already verified. You can proceed to login.',
          alreadyVerified: true 
        });
      }else{
        await this.authRepository.update(userAccount.id, { isEnabled: true, isVerified: true, verificationToken: null, verifiedAt: new Date() });
      }
      return {payload};
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        this.logger.error('Error verifying email token:', error.message);
        throw new GoneException('Verification link expired. Please request a new one.');

      }
      this.logger.error('Error verifying email token:', error instanceof Error ? error.message : error);
      throw new BadRequestException('Invalid verification token.');
    }
  }

async resendVerification(email: string) {
  try{
    const auth = await this.authRepository.findOne({ where: { email }, relations: ['user'] });   

    if (!auth) throw new AuthNotFoundException(email, 'email');
    if (auth.isVerified) throw new BadRequestException('Email is already verified');
    if (!auth.user) throw new NotFoundException('User profile not found.');

    // CALL THE HELPER
    await this.sendVerificationProcess(auth);

    return { message: 'A new verification link has been sent to your email.' };
  } 
  catch (error: unknown) {
    this.logger.error('Error in resendVerification:', error instanceof Error ? error.message : error);
    throw new BadRequestException('Failed to resend verification email. Please try again later.');
  }

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

  async verifyUser(email: string, password: string): Promise<UserPayload | null> {
    try {
      const auth = await this.authRepository.findByEmail(email);
      
      if (!auth) throw new UnauthorizedException('Invalid credentials');      

      // ALWAYS use the service so the pepper logic stays identical
      console.log(`Verifying user with email: ${email}`);
      console.log("password provided:", password);
      console.log("stored password hash:", auth.password);
      const pepper = this.configService.get<string>('HASH_PEPPER') || '';
      console.log("Using pepper:", pepper ? 'Yes' : 'No');

      const isMatch = await this.hashingService.compare(password, auth.password);

      if (!isMatch) {
        this.logger.warn(`Password mismatch for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      /*
    
      if(!isMatch && auth.isVerified){
        auth.failedLoginAttempts += 1;
        if (auth.failedLoginAttempts >= 3) {
          auth.isEnabled = false; // Disable the account after 3 failed attempts
          this.logger.warn(`Account for email ${email} has been disabled due to too many failed login attempts.`);
          throw new ForbiddenException('Account disabled due to too many failed login attempts. Please contact support.');
        } else {
          this.logger.warn(`Failed login attempt ${auth.failedLoginAttempts} for email ${email}.`);
          throw new ForbiddenException('Invalid credentials. Please try again.');          
        }        
      }else{
        // 3. Reset attempts on success
        auth.failedLoginAttempts = 0;
        await this.authRepository.update(auth.id, auth);
      }

      */

      // 2. Account Status Checks (Business Logic)
      if (!this.accessControlService.isUserActive(auth)) throw new ForbiddenException('Account is disabled'); 

      if (!this.accessControlService.isUserVerified(auth))  throw new ForbiddenException('Account not verified');
      // 3. Fetch Full Data & Map to Payload
      const user = await this.userService.findOne({ where: { id: auth.user.id }, relations: ['roles', 'roles.permissions'] });
      if (!user) throw new UnauthorizedException('User profile not found');

      return this.payloadMapperService.toUserPayload(user, email);

    } catch (error) {
      this.logger.error('Verify user error', error);
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }

  private async sendVerificationProcess(auth: Auth): Promise<void> {
    const { email, user } = auth;

    // 1. Generate the payload and token
    const verificationTokenPayload: VerificationTokenPayload = { 
      sub: user.id, 
      userId: user.id, 
      email, 
      type: 'verification' 
    };
    const verificationToken = await this.tokenService.generateVerificationToken(verificationTokenPayload);

    // 2. Persist the token to the database
    await this.authRepository.update(auth.id, { verificationToken });

    // 3. Prepare the link
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const context: VerificationEmailContext = {
      firstName: user.firstName,
      verificationLink: `${appUrl}/auth/verify-email?token=${verificationToken}`,
    };

    // 4. Dispatch Email
    await this.mailService.sendVerificationEmail(email, context);
    this.logger.log(`Verification email dispatched to: ${email}`);
  }

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
  
}
