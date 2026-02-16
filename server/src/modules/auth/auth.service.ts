// 1. NestJS & Third-Party Libs
import { BadRequestException, ConflictException, GoneException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

// 2. Services (Logic Layer)
import { AuthRepository } from './auth.repository';
import { HashingService } from '../../core/security/hashing/interfaces/hashing.service';
import { MailService } from '../../core/infrastructure/mail/mail.service';
import { TokenService } from '../../core/security/token/token.service';

// 3. Utilities & Helpers (Logic Layer)
import { AuthGeneratorUtil } from '../../common/utils/auth-generator.util';
import { ProfileGeneratorUtil } from '../../common/utils/profile-generator.util';
import { UserGeneratorUtil } from '../../common/utils/user-generator.util';

// 4. DTOs & Entities (Data Layer)
import { Auth } from './entities/auth.entity';
import { Profile } from '../profile/entities/profile.entity';
import { User } from '../user/entities/user.entity';

import { RegisterDto } from './dto/register.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

// 5. Custom Decorators (Documentation/Metatdata)
import { Service } from '../../common/decorators/service.decorator';

// 6. Interfaces (Data Layer)
import { VerificationEmailContext } from '../../core/infrastructure/mail/interfaces/mail-context.interface';
import { VerificationTokenPayload } from 'src/common/types/verification-token-payload.type';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { TokenExpiredError } from '@nestjs/jwt/dist';
import { AuthNotFoundException } from 'src/common/exceptions/auth-not-found.exception';

@Service()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService, 
    private readonly configService: ConfigService,
  ) {}  

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, dateOfBirth } = registerDto;
    
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

    if (auth?.user) {
    //Generate verification token and send email (optional)
      const verificationTokenPayload : VerificationTokenPayload = { sub: auth?.user?.id ,userId: auth?.user?.id, email: email, type: 'verification' };
      const verificationToken = await this.tokenService.generateVerificationToken(verificationTokenPayload);

      await this.authRepository.update(auth.user.id, { verificationToken });

      const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      console.log("App URL from config:", appUrl);

     const context : VerificationEmailContext = {
      firstName: auth.user.firstName,      
      verificationLink: `${appUrl}/auth/verify-email?token=${verificationToken}`,
     };
     await this.mailService.sendVerificationEmail(email, context);     
     console.log('Verification email sent to:', email);
      return { message: 'Registration successful. Please check your email to verify your account.' };
    }else {   
      throw new NotFoundException('User account not created successfully.');
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
  const auth = await this.authRepository.findOne({ where: { email }, relations: ['user'] }); //
  
  if (!auth) {
    throw new AuthNotFoundException(email, 'email');
  }
  
  if (auth.isVerified) {
    throw new BadRequestException('Email is already verified');
  }

  // Reuse your existing email sending logic here

    console.log("Newly created auth with user:", auth);

    if (!auth?.user) {
      throw new NotFoundException('User not found for the provided auth information.');
    }
    //Generate verification token and send email (optional)
      const verificationTokenPayload : VerificationTokenPayload = { sub: auth?.user?.id, userId: auth?.user?.id, email: email, type: 'verification' };
      console.log("Generated verification token payload:", verificationTokenPayload);

      const verificationToken = await this.tokenService.generateVerificationToken(verificationTokenPayload);
      console.log("Generated verification token:", verificationToken);

     const updatedUser = await this.authRepository.update(auth.id, { verificationToken });
     console.log('Updated User with Verification Token:', updatedUser);

     // Send verification email using MailService

     const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
     console.log("App URL from config:", appUrl);
     const context : VerificationEmailContext = {
      firstName: auth.user.firstName,
      verificationLink: `${appUrl}/auth/verify-email?token=${verificationToken}`,
     };
     console.log("Email context for Handlebars:", context);

     const result = await this.mailService.sendVerificationEmail(email, context);
      console.log('Email sending result:', result);

  return { message: 'A new verification link has been sent to your email.' };

}

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
}
