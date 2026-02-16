// 1. NestJS & Third-Party Libs
import { Controller, Get, Post, Body, Req, Res, HttpCode, HttpStatus, Query } from '@nestjs/common';
import type { Request, Response } from 'express';

// 2. Services & Helpers (Logic Layer)
import { AuthService } from './auth.service';


// 3. DTOs & Entities (Data Layer)
import { RegisterDto } from './dto/register.dto';



// 4. Custom Decorators (Documentation/Metatdata)
import { ApiRegisterUser } from './decorators/api-register-user.decorator';
import { ApiVerifyEmail } from './decorators/api-verify-email.decorator';


//Other
import { TokenValidationPipe } from '../../common/pipes/token-validation.pipe';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailValidationPipe } from 'src/common/pipes/email-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @ApiRegisterUser()
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received registration data:', registerDto);
    return this.authService.register(registerDto);
  }


  @Get('verify-email')
  @ApiVerifyEmail()
  async verifyEmail(@Query(TokenValidationPipe)  verifyEmailDto: VerifyEmailDto) {
    console.log('Received email verification token:', verifyEmailDto.token);
    const verificationToken = verifyEmailDto.token; 

    return await this.authService.verifyEmail(verificationToken);

  }

  @Post('resend-verification')
  async resendVerification(
    @Body('email', EmailValidationPipe) email: string // Validation happens here
  ) {
    console.log('Validating resend request for:', email);
    return await this.authService.resendVerification(email);
  }
  
}
  