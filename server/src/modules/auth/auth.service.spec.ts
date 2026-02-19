// 1. NestJS & Third-Party Libs
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config/dist/config.service';


// 2. Services (Logic Layer)
import { AuthService } from './auth.service';
import { HashingService } from '../../core/security/hashing/interfaces/hashing.service';
import { MailService } from '../../core/infrastructure/mail/mail.service';
import { PayloadMapperService } from './payload-mapper.service';
import { TokenService } from '../../core/security/token/token.service';
import { UserService } from '../user/user.service';


// 3.Repositories (Data Layer)
import { AuthRepository } from './auth.repository';

// 4. Interfaces & Types
import { AccessControlService } from '../../core/security/access-control/access-control.service';
import { SessionService } from '../session/session.service';
import { CookieService } from '../../core/security/cookie/cookie.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegistrationServiceInterface } from './services/interfaces/registration-service.interface';
import { AccountManagementServiceInterface } from './services/interfaces/account-management-service.interface';
import { PasswordManagementServiceInterface } from './services/interfaces/password-management-service.interface';
import { CredentialServiceInterface } from './services/interfaces/credential-service.interface';
import { IdentityServiceInterface } from './services/interfaces/identity-service.interface';


describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
        },
        {
          provide: HashingService,
          useValue: { hash: jest.fn() },
        },
        {
          provide: HashingService,
          useValue: { hash: jest.fn(), compare: jest.fn() },
        },
        {
          provide: TokenService,
          useValue: { generateVerificationToken: jest.fn(), verifyEmailToken: jest.fn() },
        },
        {
          provide: MailService,
          useValue: { sendVerificationEmail: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => 'test-value') } 
        },
        {
          provide: AccessControlService,
          useValue: { assignRoleToUser: jest.fn() },
        },
        {
          provide: UserService,
          useValue: { findByEmail: jest.fn() },
        },
        {
          provide: PayloadMapperService,
          useValue: { toUserPayload: jest.fn() },
        },
        {
          provide: SessionService,
          useValue: { createSession: jest.fn() },
        },
        {
          provide: CookieService,
          useValue: { setCookie: jest.fn() },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },        
        {
          provide: CredentialServiceInterface,
          useValue: { login: jest.fn(), logout: jest.fn() },
        },
        {
          provide: PasswordManagementServiceInterface,
          useValue: { forgotPassword: jest.fn(), resetPassword: jest.fn() },
        },
        {
          provide: AccountManagementServiceInterface,
          useValue: { deactivate: jest.fn() },
        },
        {
          provide: RegistrationServiceInterface,
          useValue: { register: jest.fn(), verifyEmail: jest.fn(), resendVerification: jest.fn() },
        },
        {
          provide: IdentityServiceInterface,
          useValue: { verifyUser: jest.fn(), verifyRefreshToken: jest.fn(), verifyAccessToken: jest.fn() },
        },
        
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
