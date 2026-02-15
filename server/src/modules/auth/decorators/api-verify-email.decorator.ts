import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiVerifyEmail() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
      summary: 'Verify user email via token',
      description: 'Validates a unique hash sent to the user via email to activate their account.' 
    }),
    ApiQuery({ 
      name: 'token', 
      type: String, 
      required: true,
      description: 'The unique verification hash/token received in the email' 
    }),
    ApiResponse({
      status: 200,
      description: 'Email verification successful.',
      schema: {
        example: { message: 'Email verification successful' }
      }
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Invalid or expired token.' 
    }),
    ApiResponse({ 
      status: 404, 
      description: 'User or token not found.' 
    })
  );
}
