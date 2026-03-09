import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: SessionRepository,
          useValue: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
        },
        {
          provide: CaslAbilityFactory,
          useValue: { createForUser: jest.fn() },
        }
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
