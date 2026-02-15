// 1. NestJS & Third-Party Libs
import { Test, TestingModule } from '@nestjs/testing';

// 2. Services (Logic Layer)
import { AuthService } from './auth.service';
import { HashService } from '../../core/security/hash/hash.service';

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
          provide: HashService,
          useValue: { hash: jest.fn() },
        }
        
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
