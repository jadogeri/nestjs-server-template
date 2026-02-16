import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ResendVerificationEmailDto } from '../dto/resend-verification-email.dto';

export function ApiResendVerificationEmail() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ 
      summary: 'Resend verification email',
      description: 'Triggers a new verification email to be sent to the user if the previous one expired or was lost.' 
    }),
    ApiBody({ 
      type: ResendVerificationEmailDto,
      description: 'The email address of the account to be verified'
    }),
    ApiResponse({
      status: 200,
      description: 'Verification email has been sent successfully.',
      schema: {
        example: { message: 'If an account exists with that email, a verification link has been sent.' }
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
      description: 'Internal Server Error. Failed to send email.' 
    })
  );
}
