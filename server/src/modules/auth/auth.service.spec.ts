// 1. NestJS & Third-Party Libs
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config/dist/config.service';


// 2. Services (Logic Layer)
import { AuthService } from './auth.service';
import { HashingService } from '../../core/security/hashing/interfaces/hashing.service';
import { MailService } from '../../core/infrastructure/mail/mail.service';
import { TokenService } from '../../core/security/token/token.service';

// 3.Repositories (Data Layer)
import { AuthRepository } from './auth.repository';

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
        }
        
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
