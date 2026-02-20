import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiLogout() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Log out user',
      description: 'Invalidates the current session or clears the authentication cookie.' 
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully logged out.',
      schema: {
        example: {
          message: 'Logged out successfully'
        }
      }
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized. No active session found.' 
    })
  );
}
