import { Test, TestingModule } from '@nestjs/testing';
import { GreetingsService } from './greetings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';

describe('GreetingsService', () => {
  let service: GreetingsService;
  let repo: Repository<Auth>;
  let eventEmitter: EventEmitter2;

  // Helper to create a mock QueryBuilder
  const createMockQueryBuilder = (results: any[]) => ({
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(results),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GreetingsService,
        {
          provide: getRepositoryToken(Auth),
          useValue: { createQueryBuilder: jest.fn() },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },  
      ],
    }).compile();

    service = module.get<GreetingsService>(GreetingsService);
    repo = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('1. should be defined', () => {
    expect(service).toBeDefined();
  });

  it('2. handleBirthdays: should emit events for found birthdays', async () => {
    const mockAuth = { email: 'test@test.com', user: { firstName: 'John' } };
    const queryBuilder = createMockQueryBuilder([mockAuth]);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleBirthdays();

    expect(eventEmitter.emit).toHaveBeenCalledWith('greetings.birthday', mockAuth);
  });

  it('3. handleBirthdays: should not emit events if no birthdays found', async () => {
    const queryBuilder = createMockQueryBuilder([]);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleBirthdays();

    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });

  it('4. handleBirthdays: should filter by month and day', async () => {
    const queryBuilder = createMockQueryBuilder([]);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleBirthdays();

    expect(queryBuilder.andWhere).toHaveBeenCalledWith(expect.stringContaining("strftime('%m'"), expect.any(Object));
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(expect.stringContaining("strftime('%d'"), expect.any(Object));
  });

  it('5. handleAnniversaries: should emit events with the correct year count', async () => {
    const currentYear = new Date().getFullYear();
    const joinYear = currentYear - 2;
    const mockAuth = { user: { createdAt: new Date(`${joinYear}-01-01`), firstName: 'Bob' } };
    
    const queryBuilder = createMockQueryBuilder([mockAuth]);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleAnniversaries();

    expect(eventEmitter.emit).toHaveBeenCalledWith('greetings.anniversary', mockAuth, 3);
  });

  it('6. handleAnniversaries: should only find users joined BEFORE current year', async () => {
    const queryBuilder = createMockQueryBuilder([]);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleAnniversaries();

    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('AS INTEGER) < :year'),
      expect.objectContaining({ year: expect.any(Number) })
    );
  });

  it('7. should only query enabled accounts (isEnabled = 1)', async () => {
    const queryBuilder = createMockQueryBuilder([]);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleBirthdays();

    expect(queryBuilder.where).toHaveBeenCalledWith('auth.isEnabled = :enabled', { enabled: 1 });
  });

  it('8. handleBirthdays: should handle multiple records correctly', async () => {
    const results = [{ email: 'a@a.com', user: { firstName: 'Bob' } }, { email: 'b@b.com' ,user: { firstName: 'Alice' } }];
    const queryBuilder = createMockQueryBuilder(results);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleBirthdays();

    expect(eventEmitter.emit).toHaveBeenCalledTimes(2);
  });

  it('9. handleAnniversaries: should correctly format join year from user date', async () => {
    const mockAuth = { user: { createdAt: '2020-05-15' } };
    const queryBuilder = createMockQueryBuilder([mockAuth]);
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await service.handleAnniversaries();
    
    const expectedDiff = new Date().getFullYear() - 2020;
    expect(eventEmitter.emit).toHaveBeenCalledWith('greetings.anniversary', mockAuth, expectedDiff);
  });

  it('10. should handle repository errors gracefully', async () => {
    const queryBuilder = {
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockRejectedValue(new Error('DB Error')),
    };
    jest.spyOn(repo, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

    await expect(service.handleBirthdays()).rejects.toThrow('DB Error');
  });
});
