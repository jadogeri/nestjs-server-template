// 1. NestJS & Third-Party Libs
import { Controller, Get, Post, Body, Req, Res, HttpCode, HttpStatus, Query } from '@nestjs/common';
import type { Request, Response } from 'express';

// 2. Services & Helpers (Logic Layer)
import { AuthService } from './auth.service';


// 3. DTOs & Entities (Data Layer)
import { RegisterDto } from './dto/register.dto';



// 4. Custom Decorators (Documentation/Metatdata)
import { ApiRegisterUser } from './decorators/api-register-user.decorator';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @ApiRegisterUser()
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received registration data:', registerDto);
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email via token' })
  @ApiQuery({ name: 'token', type: String, description: 'The unique verification hash' }) // This adds it to Swagger
  @Get('verify-email')
  async verifyEmail(@Query('token', TokenValidationPipe)  token: string) {
    // verifyEmailDto.token will contain the token from the URL
    console.log('Received email verification token:', token);
    return { message: 'Email verification successful' };
    //await this.authService.verifyEmail(token);
  }
  
}
