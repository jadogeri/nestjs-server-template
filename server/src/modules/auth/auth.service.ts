// 1. NestJS & Third-Party Libs
import { ConflictException, NotFoundException } from '@nestjs/common';

// 2. Services (Logic Layer)
import { AuthRepository } from './auth.repository';
import { HashingService } from '../../core/security/hashing/interfaces/hashing.service';

// 3. Utilities & Helpers (Logic Layer)
import { AuthGeneratorUtil } from 'src/common/utils/auth-generator.util';
import { ProfileGeneratorUtil } from 'src/common/utils/profile-generator.util';
import { UserGeneratorUtil } from 'src/common/utils/user-generator.util';

// 4. DTOs & Entities (Data Layer)
import { RegisterDto } from './dto/register.dto';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

// 5. Custom Decorators (Documentation/Metatdata)
import { Service } from '../../common/decorators/service.decorator';


@Service()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
  ) {}  

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, dateOfBirth } = registerDto;
    
    const existingAuth = await this.authRepository.findOne({ where: { email } });
    if (existingAuth) {
      throw new ConflictException(`Email address "${email}" has already been registered.`);
    }
    const userPayload = UserGeneratorUtil.generate({ firstName, lastName, dateOfBirth });
    console.log("Generated user payload:", userPayload);
    const hashedPassword = await this.hashingService.hash(password);    
    console.log("Hashed password:", hashedPassword);
    const authPayload = AuthGeneratorUtil.generate({ email, password: hashedPassword });
    console.log("Generated auth payload:", authPayload);
    authPayload.user = userPayload; // Cascading will handle the user creation

    const profilePayload = ProfileGeneratorUtil.generate({}); // You can pass necessary data if needed
    console.log("Generated profile payload:", profilePayload);
    userPayload.profile = profilePayload; // Assign the profile to the user

    const savedAuth = await this.authRepository.create(authPayload);  
    
    // RELOAD: This fetches the Auth AND the User together
    const auth =  await this.authRepository.findOne({
      where: { id: savedAuth.id }, relations: ['user' , 'user.roles'] // Ensure roles are included
    });

    if (auth?.user) {
    //Generate verification token and send email (optional)
      const verificationTokenPayload = { id: auth?.user?.id, email: email};
      console.log("Generated verification token payload:", verificationTokenPayload);

      const verificationToken = await this.tokenService.generateVerificationToken(verificationTokenPayload);
      console.log("Generated verification token:", verificationToken);

      await this.authRepository.update(auth.user.id, { verificationToken });

     const context : VerificationEmailContext = {
      firstName: auth.user.firstName,      
      verificationLink: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
     };
     await this.mailService.sendVerificationEmail(email, context);     
     console.log('Verification email sent to:', email);
      return { message: 'Registration successful. Please check your email to verify your account.' };
    }else {   
      throw new NotFoundException('User acocount not created successfully.');
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
