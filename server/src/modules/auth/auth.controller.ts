// 1. NestJS & Third-Party Libs
import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

// 2. Services & Helpers (Logic Layer)
import { AuthService } from './auth.service';


// 3. DTOs & Entities (Data Layer)
import { RegisterDto } from './dto/register.dto';



// 4. Custom Decorators (Documentation/Metatdata)
import { ApiRegisterUser } from './decorators/api-register-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @ApiRegisterUser()
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received registration data:', registerDto);
    return this.authService.register(registerDto);
  }
  
}
