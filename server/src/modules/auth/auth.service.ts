// 1. NestJS & Third-Party Libs
import { ConflictException, NotFoundException } from '@nestjs/common';
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

@Service()
export class AuthService {

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
      const verificationTokenPayload = { id: auth?.user?.id, email: email};
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
      const{ id, email } = payload;
      const userAccount = await this.authRepository.findOne({ where: { user: { id }, email }, relations: ['user'] });
      if (!userAccount) {
        return { message:" success" }
      }
      if (userAccount.isVerified) {
       throw new ConflictException({ message: 'Your email is already verified. You can proceed to login.',
                alreadyVerified: true });
      }else{
        await this.authRepository.update(userAccount.id, { isEnabled: true, isVerified: true, verificationToken: null, verifiedAt: new Date() });
      }
      return {payload};
      // ... update user to verified in DB  
    } catch (error:unknown) {
      if (error instanceof TokenExpiredError) {
        log('Error verifying email token:', error.message);
        throw new GoneException('Verification link expired. Please request a new one.');

      }
      log('Error verifying email token:', error instanceof Error ? error.message : error);
      throw new BadRequestException('Invalid verification token.');
    }
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
