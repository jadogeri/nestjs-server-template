import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';

export function ApiRegisterUser() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Create a new user account',
      description: 'Registers a new user in the system and triggers a verification email. The email address must be unique.' 
    }),
    ApiBody({ 
      type: RegisterDto,
      examples: {
        example1: {
          summary: 'Standard Registration',
          value: { 
            firstName: 'John', 
            lastName: 'Doe', 
            email: 'john.doe@example.com', 
            dateOfBirth: '01-FEB-1990', 
            password: "P@55W0rd" 
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'Registration successful. Verification email sent.',
      schema: {
        example: { success: true, message: 'Registration successful. Please check your email...' }
      }
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Bad Request. Validation failed (e.g., weak password or invalid email format).' 
    }),
    ApiResponse({ 
      status: 409, 
      description: 'Conflict. An account with this email address already exists.' 
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal Server Error. Failed to send verification email.' 
    })
  );
}
