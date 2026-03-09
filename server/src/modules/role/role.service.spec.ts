import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';


describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
        },
        {
          provide: CaslAbilityFactory,
          useValue: { createForUser: jest.fn() },
        }
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
