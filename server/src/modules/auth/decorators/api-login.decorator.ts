import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export function ApiLogin() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
      summary: 'Authenticate user and return JWT token',
      description: 'Validates credentials via LocalAuthGuard and issues an Access Token and Refresh Token.' 
    }),
    ApiBody({ 
      type: LoginDto,
      description: 'User credentials for authentication'
    }),
    ApiResponse({
      status: 200,
      description: 'Authentication successful. Tokens generated.',
      schema: {
        example: {
          accessToken: 'eyJhbGci...',
          user: { id: 1, email: 'user@example.com' }
        }
      }
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized. Invalid email or password.' 
    }),
    ApiResponse({ 
      status: 403, 
      description: 'Forbidden. Account might be disabled or unverified.' 
    })
  );
}
