import { applyDecorators, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiGetMe() {
  return applyDecorators(
    Get('me'),
    HttpCode(HttpStatus.OK),
    ApiBearerAuth(), // This adds the "Authorize" padlock in Swagger
    ApiOperation({ 
      summary: 'Get current user profile',
      description: 'Retrieves the decoded JWT payload for the currently authenticated user.' 
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved user payload.',
      schema: {
        example: {
          sub: 1,
          email: 'user@example.com',
          roles: ['admin'],
          iat: 1771195426,
          exp: 1771199026
        }
      }
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized. Missing or invalid access token.' 
    })
  );
}
