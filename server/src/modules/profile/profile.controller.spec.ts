import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CaslAbilityFactory } from '../../core/security/casl/casl-ability.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
        },
        {
          provide: CaslAbilityFactory,
          useValue: { createForUser: jest.fn() },
        }
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
