import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';


export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Initiate password recovery',
      description: 'Sends a password reset link to the provided email address if the account exists.' 
    }),
    ApiBody({ 
      type: ForgotPasswordDto,
      examples: {
        example1: {
          summary: 'Valid Request',
          value: { 
            email: 'user@example.com' 
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Reset email triggered successfully.',
      schema: {
        example: { success: true, message: 'If an account exists with that email, a reset link has been sent.' }
      }
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Bad Request. Invalid email format.' 
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal Server Error. Mail service failure.' 
    })
  );
}
