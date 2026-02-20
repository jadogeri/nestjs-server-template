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
import { RefreshTokenPayload } from '../../common/types/refresh-token-payload.type';
import { RegistrationServiceInterface } from './services/interfaces/registration-service.interface';
import { CredentialServiceInterface } from './services/interfaces/credential-service.interface';
import { AccountManagementServiceInterface } from './services/interfaces/account-management-service.interface';
import { PasswordManagementServiceInterface } from './services/interfaces/password-management-service.interface';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IdentityServiceInterface } from './services/interfaces/identity-service.interface';
import { AccessTokenPayload } from '../../common/types/access-token-payload.type';


@Service()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly registrationSercive: RegistrationServiceInterface, 
    private readonly credentialService: CredentialServiceInterface,
    private readonly passwordManagementService: PasswordManagementServiceInterface,
    private readonly account: AccountManagementServiceInterface,
    private readonly authRepository: AuthRepository,

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

    return await this.credentialService.login(res, userPayload);

  };  

  async refreshToken(refreshTokenPayload: RefreshTokenPayload, res: Response<any, Record<string, any>>): Promise<any> { 

    return await this.credentialService.refreshToken(refreshTokenPayload, res);
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


  async logout(res: Response<any, Record<string, any>>, refreshTokenPayload: RefreshTokenPayload): Promise<any> {
    return await this.credentialService.logout(res, refreshTokenPayload);
  }
      
  
}
