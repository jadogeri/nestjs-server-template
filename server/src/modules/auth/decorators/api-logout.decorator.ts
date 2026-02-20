import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';

/**
 * Decorator for the Logout endpoint.
 * Ensures Swagger documentation reflects that the 'refresh-token' cookie is required to clear the session.
 */
export function ApiLogout() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiCookieAuth('refresh-token'), // Matches the cookie name used in your ApiRefresh template
    ApiOperation({ 
      summary: 'Logout user',
      description: 'Invalidates the session by clearing the refresh token cookie.' 
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully logged out. Cookies cleared.'
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized - No active session found.' 
    })
  );
}
