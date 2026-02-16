// 1. NestJS & Third-Party Libs
import { BadRequestException, ConflictException, ForbiddenException, GoneException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { v4 as uuidv4 } from 'uuid'; // Install 'uuid' package


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
import { TokenExpiredError } from '@nestjs/jwt/dist';
import { AuthNotFoundException } from '../../common/exceptions/auth-not-found.exception';
import { UserPayload } from '../../common/interfaces/user-payload.interface';
import { PayloadMapperService } from './payload-mapper.service';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';


@Service()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

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
    const sessionId = uuidv4();
    console.log("Generated session ID:", sessionId);

    // B. Generate tokens, passing the sessionId so it can be embedded in the payload
    const data = await this.tokenService.generateAuthTokens(userPayload, sessionId); 
    
    // C. Hash the refresh token
    const hashedRefreshToken = await this.hashingService.hash(data.refreshToken);

    // D. Create the session in DB using our pre-generated ID
    // Ensure your Session entity/DTO accepts 'id' or 'sessionId'
    const createSessionDto = { 
        userId: userPayload.userId, 
        refreshTokenHash: hashedRefreshToken,
        sessionId: sessionId // Include sessionId if your DTO requires it
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

  async create(createAuthDto: CreateAuthDto) {
    return await this.authRepository.create(createAuthDto);
  }

  async findAll() {
    return await this.authRepository.findAll({});
  }

  async findOne(id: number) {    
    return await this.authRepository.findOne({ where: { id }, relations: [] });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.authRepository.update(id, updateAuthDto);
  }

  async remove(id: number) {
    return await this.authRepository.delete(id);
  }

  async verifyUser(email: string, password: string): Promise<UserPayload | null> {
    try {
      const auth = await this.authRepository.findOne({ where: { email }, relations: ['user'] });
      
      if (!auth) throw new UnauthorizedException('Invalid credentials');

      // ALWAYS use the service so the pepper logic stays identical
      const authenticated = await this.hashingService.compare(password, auth.password);

      if (!authenticated) throw new UnauthorizedException("Invalid credentials provided");

      // 2. Account Status Checks (Business Logic)
      if (!this.accessControlService.isUserActive(auth)) throw new ForbiddenException('Account is disabled'); 

      if (!this.accessControlService.isUserVerified(auth))  throw new ForbiddenException('Account not verified');
      // 3. Fetch Full Data & Map to Payload
      const user = await this.userService.findOne({ where: { id: auth.user.id }, relations: ['roles', 'permissions'] });
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


  
}
