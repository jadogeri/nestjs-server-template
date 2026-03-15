import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ReactivateRequestDto } from '../dto/reactivate-request.dto'; // Adjust path

export function ApiReactivateRequest() {
  return applyDecorators(
    // Usually no ApiBearerAuth() here because the user is currently deactivated/logged out
    ApiOperation({ 
      summary: 'Request account reactivation',
      description: 'Initiates the reactivation process by sending a verification token to the provided email address if the account is currently inactive.' 
    }),
    ApiBody({ 
      type: ReactivateRequestDto,
      examples: {
        example1: {
          summary: 'Standard Reactivation Request',
          value: { 
            email: 'john.doe@example.com' 
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'Reactivation email sent successfully.',
      schema: {
        example: { 
          success: true, 
          message: 'If an account exists with this email, a reactivation link has been sent.' 
        }
      }
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Bad Request. Invalid email format.' 
    }),
    ApiResponse({ 
      status: 429, 
      description: 'Too Many Requests. Please wait before requesting another email.' 
    }),
    ApiResponse({ 
      status: 500, 
      description: 'Internal Server Error.' 
    })
  );
}
