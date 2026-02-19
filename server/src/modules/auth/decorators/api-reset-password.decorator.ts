import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordDto } from '../dto/reset-password.dto';

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Reset user password',
      description: 'Updates the user password by verifying the old password and ensuring the new password matches the confirmation.' 
    }),
    ApiBody({ 
      type: ResetPasswordDto,
      examples: {
        example1: {
          summary: 'Standard Reset',
          value: { 
            email: 'john.doe@example.com',
            oldPassword: 'OldPassword123!',
            newPassword: 'NewStrongPass456!',
            confirmPassword: 'NewStrongPass456!'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Password updated successfully.',
      schema: {
        example: { success: true, message: 'Your password has been successfully updated.' }
      }
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Validation failed (e.g., passwords do not match or weak password).' 
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized. The old password provided is incorrect.' 
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal Server Error.' 
    })
  );
}
