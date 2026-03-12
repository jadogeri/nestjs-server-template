import { Test, TestingModule } from '@nestjs/testing';
import { SessionCleanupService } from './session-cleanup.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from '../../../../modules/session/entities/session.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

describe('SessionCleanupService', () => {
  let service: SessionCleanupService;
  let repo: Repository<Session>;
  let loggerSpy: jest.SpyInstance;

  // Mocking the QueryBuilder chain
  const mockDeleteQueryBuilder = {
    delete: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 5 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionCleanupService,
        {
          provide: getRepositoryToken(Session),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockDeleteQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<SessionCleanupService>(SessionCleanupService);
    repo = module.get<Repository<Session>>(getRepositoryToken(Session));
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Check definition
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 2. Verify Delete call
  it('should call delete on the query builder', async () => {
    await service.handleCleanup();
    expect(mockDeleteQueryBuilder.delete).toHaveBeenCalled();
  });

  // 3. Verify SQLite where clause
  it('should use the correct SQLite datetime string in where clause', async () => {
    await service.handleCleanup();
    expect(mockDeleteQueryBuilder.where).toHaveBeenCalledWith(
      "expiresAt < datetime('now', '-2 minutes')"
    );
  });

  // 4. Verify Execute call
  it('should call execute to perform the deletion', async () => {
    await service.handleCleanup();
    expect(mockDeleteQueryBuilder.execute).toHaveBeenCalled();
  });

  // 5. Successful Log
  it('should log the start of the task', async () => {
    await service.handleCleanup();
    expect(loggerSpy).toHaveBeenCalledWith('Running session cleanup task...');
  });

  // 6. Debug Log with affected count
  it('should log the correct number of affected rows in debug', async () => {
    const debugSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    mockDeleteQueryBuilder.execute.mockResolvedValueOnce({ affected: 10 });
    
    await service.handleCleanup();
    
    expect(debugSpy).toHaveBeenCalledWith('Cleanup complete. Removed 10 expired tokens.');
  });

  // 7. Handle Zero deletions
  it('should log 0 if no tokens were affected', async () => {
    const debugSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    mockDeleteQueryBuilder.execute.mockResolvedValueOnce({ affected: 0 });
    
    await service.handleCleanup();
    
    expect(debugSpy).toHaveBeenCalledWith('Cleanup complete. Removed 0 expired tokens.');
  });

  // 8. Error Handling (Graceful crash)
  it('should throw an error if the database query fails', async () => {
    mockDeleteQueryBuilder.execute.mockRejectedValueOnce(new Error('DB Fail'));
    
    await expect(service.handleCleanup()).rejects.toThrow('DB Fail');
  });

  // 9. QueryBuilder Initialization
  it('should initialize createQueryBuilder without arguments', async () => {
    await service.handleCleanup();
    expect(repo.createQueryBuilder).toHaveBeenCalledWith();
  });

});
