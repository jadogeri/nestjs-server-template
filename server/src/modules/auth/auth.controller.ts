import { AuthService } from './auth.service';


import { Controller, Get, Post, Body, Patch, Delete, HttpCode, HttpStatus, Query, UseGuards, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiRegisterUser } from './decorators/api-register-user.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @ApiRegisterUser()
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received registration data:', registerDto);
    return { success: true, message: 'Registration successful. Please check your email to verify your account.' };
  }

}
