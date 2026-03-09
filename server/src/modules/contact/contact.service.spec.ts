import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { ContactRepository } from './contact.repository';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../../core//infrastructure/cache/cache.service';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: ContactRepository,
          useValue: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
        },
        {
          provide: CaslAbilityFactory,
          useValue: {
            createForUser: jest.fn(), // Mock the CASL factory
          },
        },
        {
          provide: Reflector,
          useValue: {}, // Required by most Guards
        },
        {
          provide: CacheService,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() }, // Mock the CacheService
        }
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
