import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { ContactRepository } from './contact.repository';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: ContactRepository,
          useValue: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
        }
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
