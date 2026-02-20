import { ConflictException, NotFoundException, GoneException, BadRequestException, Logger } from "@nestjs/common";
import { TokenExpiredError } from "@nestjs/jwt";
import { AuthGeneratorUtil } from "../../../common/utils/auth-generator.util";
import { ProfileGeneratorUtil } from "../../../common/utils/profile-generator.util";
import { UserGeneratorUtil } from "../../../common/utils/user-generator.util";
import { User } from "../../../modules/user/entities/user.entity";
import{ Auth } from "../../../modules/auth/entities/auth.entity";
import { Service } from "../../../common/decorators/service.decorator";
import { RegisterDto } from "../dto/register.dto";
import { RegistrationServiceInterface } from "./interfaces/registration-service.interface";
import { AuthRepository } from "../auth.repository";
import { TokenService } from "../../../core/security/token/token.service";
import { HashingService } from "../../../core/security/hashing/interfaces/hashing.service";
import { Profile } from "src/modules/profile/entities/profile.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception";
import { AuthNotFoundException } from "src/common/exceptions/auth-not-found.exception";
import { StatusEnum } from "src/common/enums/user-status.enum";

@Service()
export class RegistrationService implements RegistrationServiceInterface {  

  private readonly logger = new Logger(RegistrationService.name);
  
  constructor(
      private readonly authRepository: AuthRepository, // Also injected here
      private readonly hashingService: HashingService,
      private readonly tokenService: TokenService,   
      private readonly eventEmitter: EventEmitter2, // For emitting events
  ){ }

  async register(registerDto: RegisterDto): Promise<any> {
    
    const { email, password, firstName, lastName, dateOfBirth } = registerDto;    
    const existingAuth = await this.authRepository.findOne({ where: { email } });
    if (existingAuth) throw new ConflictException(`Email address "${email}" has already been registered.`);
    
    const userPayload : User = UserGeneratorUtil.generate({ firstName, lastName, dateOfBirth });
    const hashedPassword = await this.hashingService.hash(password);    
    const authPayload : Auth = AuthGeneratorUtil.generate({ email, password: hashedPassword });
    authPayload.user = userPayload; // Cascading will handle the user creation

    const profilePayload : Profile = ProfileGeneratorUtil.generate(); // You can pass necessary data if needed      
    userPayload.profile = profilePayload; // Assign the profile to the user

    const savedAuth = await this.authRepository.create(authPayload);  
    
    const auth =  await this.authRepository.findOne({
      where: { id: savedAuth.id }, relations: ['user' , 'user.roles'] 
    });

    if (!auth?.user) throw new NotFoundException('User account creation failed.');

    this.eventEmitter.emit('user.register', auth);

    const result = { message: 'Registration successful! Please check your email to verify your account.' };
    this.eventEmitter.emit('user.verify', auth);
    return result;
  
  }

  async verifyEmail(token: string): Promise<any> {
    try {
      const payload = await this.tokenService.verifyEmailToken(token);
      console.log('Email verification token payload:', payload);
      const{ userId, email } = payload;
      const auth = await this.authRepository.findOne({ where: { user: { id: userId }, email }, relations: ['user'] });
      if (!auth) {
        throw new UserNotFoundException("No user account found for this verification token.");
      }
      if (auth.isVerified) {
        throw new ConflictException({ 
          message: 'Your email is already verified. You can proceed to login.',
          alreadyVerified: true 
        });
      }else{
        await this.authRepository.update(auth.id, { status: StatusEnum.ENABLED, isVerified: true, verificationToken: null, verifiedAt: new Date() });
      }
      // CALL THE HELPER
      this.eventEmitter.emit('user.register', auth);

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

  async resendVerification(email: string): Promise<any> {
    try{
      const auth = await this.authRepository.findOne({ where: { email }, relations: ['user'] });   

      if (!auth) throw new AuthNotFoundException(email, 'email');
      if (auth.isVerified) throw new BadRequestException('Email is already verified');
      if (!auth.user) throw new NotFoundException('User profile not found.');

      // CALL THE HELPER
      this.eventEmitter.emit('user.verify', auth);

      return { message: 'A new verification link has been sent to your email.' };
    } 
    catch (error: unknown) {
      this.logger.error('Error in resendVerification:', error instanceof Error ? error.message : error);
      throw new BadRequestException('Failed to resend verification email. Please try again later.');
    }

  }
 
}