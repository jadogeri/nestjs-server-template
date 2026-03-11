import { PaginationInterceptor } from './pagination.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('PaginationInterceptor', () => {
  let interceptor: PaginationInterceptor;
  let mockResponse: any;
  let mockContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new PaginationInterceptor();

    // Mock Express Response object
    mockResponse = {
      setHeader: jest.fn(),
    };

    // Mock NestJS ExecutionContext
    mockContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    };
  });

  // 1. Basic Instantiation
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  // 2. Handle simple array
  it('should set X-Total-Count based on array length', (done) => {
    const data = [1, 2, 3];
    mockCallHandler = { handle: () => of(data) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe(() => {
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Count', 3);
      done();
    });
  });

  // 3. Expose headers for simple array
  it('should set Access-Control-Expose-Headers for arrays', (done) => {
    mockCallHandler = { handle: () => of([1]) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe(() => {
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Access-Control-Expose-Headers', 'X-Total-Count');
      done();
    });
  });

  // 4. Handle object with items/total (unwrapping)
  it('should extract items and set X-Total-Count from object properties', (done) => {
    const data = { items: ['a', 'b'], total: 50 };
    mockCallHandler = { handle: () => of(data) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe((result) => {
      expect(result).toEqual(['a', 'b']);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Count', 50);
      done();
    });
  });

  // 5. Handle zero total
  it('should correctly set header when total is 0', (done) => {
    const data = { items: [], total: 0 };
    mockCallHandler = { handle: () => of(data) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe(() => {
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Count', 0);
      done();
    });
  });

  // 6. Pass through non-matching objects
  it('should return original data if it is not an array or matching object', (done) => {
    const data = { foo: 'bar' };
    mockCallHandler = { handle: () => of(data) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe((result) => {
      expect(result).toEqual(data);
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
      done();
    });
  });

  // 7. Handle null data
  it('should handle null response without crashing', (done) => {
    mockCallHandler = { handle: () => of(null) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe((result) => {
      expect(result).toBeNull();
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
      done();
    });
  });

  // 8. Call order validation
  it('should call next.handle() before accessing context', (done) => {
    mockCallHandler = { handle: jest.fn().mockReturnValue(of([])) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe(() => {
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(mockContext.switchToHttp).toHaveBeenCalled();
      done();
    });
  });

  // 9. Handling empty arrays
  it('should set X-Total-Count to 0 for empty arrays', (done) => {
    mockCallHandler = { handle: () => of([]) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe(() => {
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Total-Count', 0);
      done();
    });
  });

  // 10. Check for missing total property
  it('should not set headers if total is missing from object', (done) => {
    const data = { items: [1, 2, 3] }; // Missing 'total'
    mockCallHandler = { handle: () => of(data) };

    interceptor.intercept(mockContext as any, mockCallHandler as any).subscribe((result) => {
      expect(result).toEqual(data);
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
      done();
    });
  });
});
