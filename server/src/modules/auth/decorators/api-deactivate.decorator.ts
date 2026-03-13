import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeactivateDto } from '../dto/deactivate.dto'; // Adjust path as needed

export function ApiDeactivateUser() {
  return applyDecorators(
    ApiBearerAuth(), // Important since a token is required
    ApiOperation({ 
      summary: 'Deactivate user account',
      description: 'Sets the user account to an inactive state. Requires a valid access token and email confirmation to prevent accidental deactivation.' 
    }),
    ApiBody({ 
      type: DeactivateDto,
      examples: {
        example1: {
          summary: 'Standard Deactivation',
          value: { 
            email: 'john.doe@example.com', 
            confirm: true 
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Account successfully deactivated.',
      schema: {
        example: { success: true, message: 'Your account has been deactivated.' }
      }
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Bad Request. Validation failed or "confirm" was not set to true.' 
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized. Missing or invalid access token.' 
    }),
    ApiResponse({ 
      status: 403, 
      description: 'Forbidden. The provided email does not match the authenticated user.' 
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal Server Error.' 
    })
  );
}
