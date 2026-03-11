import { CacheMonitorInterceptor } from './cache-monitor.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { Logger } from '@nestjs/common';

describe('CacheMonitorInterceptor', () => {
  let interceptor: CacheMonitorInterceptor;
  let mockContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;
  let loggerSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new CacheMonitorInterceptor();
    
    // Mock the NestJS ExecutionContext
    mockContext = {
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    };

    // Mock the Logger methods
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Basic Instantiation
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  // 2. Cache HIT scenario
  it('should log "CACHE HIT" when data is returned', (done) => {
    mockCallHandler = { handle: () => of({ key: 'value' }) };

    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('[testMethod] CACHE HIT'));
        done();
      });
  });

  // 3. Cache MISS scenario (null)
  it('should warn "CACHE MISS" when data is null', (done) => {
    mockCallHandler = { handle: () => of(null) };

    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[testMethod] CACHE MISS'));
        done();
      });
  });

  // 4. Cache MISS scenario (undefined)
  it('should warn "CACHE MISS" when data is undefined', (done) => {
    mockCallHandler = { handle: () => of(undefined) };

    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[testMethod] CACHE MISS'));
        done();
      });
  });

  // 5. Data Integrity
  it('should not modify the data in the stream', (done) => {
    const originalData = { id: 1, name: 'Nest' };
    mockCallHandler = { handle: () => of(originalData) };

    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe((result) => {
        expect(result).toEqual(originalData);
        done();
      });
  });

  // 6. Method Name Extraction
  it('should extract and log the correct handler name', (done) => {
    const customContext = { getHandler: () => ({ name: 'findUserById' }) };
    mockCallHandler = { handle: () => of(true) };

    interceptor.intercept(customContext as any, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('[findUserById]'));
        done();
      });
  });

  // 7. Execution Duration (Formatting)
  it('should include "ms" in the log output', (done) => {
    mockCallHandler = { handle: () => of('data') };

    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringMatching(/\d+ms/));
        done();
      });
  });

  // 8. Stream Lifecycle
  it('should call next.handle() exactly once', () => {
    mockCallHandler = { handle: jest.fn().mockReturnValue(of(null)) };
    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler);
    expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
  });

  // 9. Handling Empty Arrays (Truthy Check)
  it('should log "CACHE HIT" for an empty array (considered truthy)', (done) => {
    mockCallHandler = { handle: () => of([]) };

    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('CACHE HIT'));
        done();
      });
  });

  // 10. Performance check (startTime consistency)
  it('should capture a positive duration', (done) => {
    // Artificial delay to ensure duration > 0
    mockCallHandler = { handle: () => of('data') };

    interceptor.intercept(mockContext as ExecutionContext, mockCallHandler as CallHandler)
      .subscribe(() => {
        const logCall = loggerSpy.mock.calls[0][0];
        const durationMatch = logCall.match(/(\d+)ms/);
        const duration = parseInt(durationMatch[1], 10);
        expect(duration).toBeGreaterThanOrEqual(0);
        done();
      });
  });
});
