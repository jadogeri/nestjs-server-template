import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteUserResponseDto } from '../dto/api-delete-user-response.dto';

export function ApiDeleteMe() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Delete current user account',
      description: 'Permanently removes the authenticated user account and all associated data.' 
    }),
    ApiResponse({
      status: 200,
      description: 'Account successfully deleted.',
      type: DeleteUserResponseDto,
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized. Missing or invalid access token.' 
    }),
    ApiResponse({ 
      status: 403, 
      description: 'Forbidden. You do not have permission to delete this account.' 
    })
  );
}
