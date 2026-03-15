import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function ApiVerifyReactivate() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Verify reactivation token', 
      description: 'Activates a deactivated account using a unique token from an email link.' 
    }),
    ApiQuery({ name: 'token', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Account successfully reactivated.' }),
    ApiResponse({ status: 400, description: 'Token is invalid or has expired.' }),
  );
}
