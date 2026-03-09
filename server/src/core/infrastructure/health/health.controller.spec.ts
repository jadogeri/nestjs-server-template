import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { 
  HealthCheckService, 
  HttpHealthIndicator, 
  TypeOrmHealthIndicator, 
  DiskHealthIndicator, 
  MemoryHealthIndicator 
} from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let health: HealthCheckService;

  const mockHealthCheckService = { check: jest.fn() };
  const mockHttp = { pingCheck: jest.fn() };
  const mockDb = { pingCheck: jest.fn() };
  const mockDisk = { checkStorage: jest.fn() };
  const mockMemory = { checkHeap: jest.fn(), checkRSS: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockHttp },
        { provide: TypeOrmHealthIndicator, useValue: mockDb },
        { provide: DiskHealthIndicator, useValue: mockDisk },
        { provide: MemoryHealthIndicator, useValue: mockMemory },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    health = module.get<HealthCheckService>(HealthCheckService);
    jest.clearAllMocks();
  });

  describe('Happy Path (6 Tests)', () => {
    it('should return 200 status when all indicators are healthy', async () => {
      const result = { status: 'ok', info: { database: { status: 'up' } } };
      mockHealthCheckService.check.mockResolvedValue(result);
      expect(await controller.check()).toBe(result);
    });

    it('should call health.check with exactly 5 indicator functions', async () => {
      await controller.check();
      const checkArgument = mockHealthCheckService.check.mock.calls[0][0];
      expect(checkArgument.length).toBe(5);
    });

    it('should trigger the HTTP ping check for NestJS docs', async () => {
      mockHealthCheckService.check.mockImplementation((indicators) => indicators[0]());
      await controller.check();
      expect(mockHttp.pingCheck).toHaveBeenCalledWith('nestjs-docs', expect.any(String));
    });

    it('should trigger the Database ping check', async () => {
      mockHealthCheckService.check.mockImplementation((indicators) => indicators[1]());
      await controller.check();
      expect(mockDb.pingCheck).toHaveBeenCalledWith('database');
    });

    it('should check disk storage with the correct platform path', async () => {
      mockHealthCheckService.check.mockImplementation((indicators) => indicators[2]());
      await controller.check();
      const expectedPath = process.platform === 'win32' ? 'C:\\' : '/';
      expect(mockDisk.checkStorage).toHaveBeenCalledWith('storage', expect.objectContaining({ path: expectedPath }));
    });

    it('should check memory heap with the defined threshold', async () => {
      mockHealthCheckService.check.mockImplementation((indicators) => indicators[3]());
      await controller.check();
      expect(mockMemory.checkHeap).toHaveBeenCalledWith('memory_heap', 150 * 1024 * 1024);
    });
  });

  describe('Edge Cases (6 Tests)', () => {
    it('should throw ServiceUnavailableException if health check fails', async () => {
      mockHealthCheckService.check.mockRejectedValue(new Error('Health Check Failed'));
      await expect(controller.check()).rejects.toThrow('Health Check Failed');
    });

    it('should return "error" status if one service is down', async () => {
      const errorResult = { status: 'error', error: { database: { status: 'down' } } };
      mockHealthCheckService.check.mockResolvedValue(errorResult);
      expect(await controller.check()).toBe(errorResult);
    });

     it('should trigger the Memory RSS check as the 5th indicator', async () => {
      mockHealthCheckService.check.mockImplementation((indicators) => indicators[4]());
      await controller.check();
      expect(mockMemory.checkRSS).toHaveBeenCalledWith('memory_rss', 500 * 1024 * 1024);
    });

    it('should use 0.5 (50%) as the disk threshold percent', async () => {
      mockHealthCheckService.check.mockImplementation((indicators) => indicators[2]());
      await controller.check();
      expect(mockDisk.checkStorage).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ thresholdPercent: 0.5 }));
    });

    it('should handle empty responses from indicators gracefully', async () => {
      mockHealthCheckService.check.mockResolvedValue({});
      const result = await controller.check();
      expect(result).toEqual({});
    });
  });
});
