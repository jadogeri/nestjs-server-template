import { AuthService } from './auth.service';


import { Controller,Get, Post, Body, Patch, Delete, HttpCode, HttpStatus, Query, UseGuards, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';


import { ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ 
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Example Auth Creation',
        value: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', dateOfBirth: '01-FEB-1990', password:"P@55W0rd" }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', dateOfBirth: '01-FEB-1990' }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received registration data:', registerDto);
    return "{success: true, message: 'Registration successful. Please check your email to verify your account.'}";
  }

}
