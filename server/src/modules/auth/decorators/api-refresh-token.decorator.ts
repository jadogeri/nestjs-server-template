import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';

export function ApiRefresh() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiCookieAuth('refresh-token'), // Indicates the cookie name defined in Swagger config
    ApiOperation({ 
      summary: 'Refresh access tokens via Cookie',
      description: 'Reads the refresh token from an HTTP-only cookie to issue new tokens.' 
    }),
    ApiResponse({
      status: 200,
      description: 'Tokens successfully refreshed.',
      schema: {
        example: { 
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }),
    ApiResponse({ status: 400, description: 'Cookie missing or expired.' }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized - Invalid or expired refresh token.' 
    }),
    ApiResponse({ 
      status: 403, 
      description: 'Forbidden - Token has been revoked or reuse detected.' 
    })
  );
}