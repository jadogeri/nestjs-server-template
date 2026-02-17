// 1. NestJS & Third-Party Libs
import { Controller, Get, Post, Body, Req, Res, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

// 2. Services & Helpers (Logic Layer)
import { AuthService } from './auth.service';

// 3. DTOs & Entities (Data Layer)
import { RegisterDto } from './dto/register.dto';
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';





// 4. Custom Decorators (Documentation/Metatdata)
import { ApiLogin } from './decorators/api-login.decorator';
import { ApiRegisterUser } from './decorators/api-register-user.decorator';
import { ApiResendVerificationEmail } from './decorators/api-resend-verification-email.decorator';
import { ApiVerifyEmail } from './decorators/api-verify-email.decorator';
import { User } from '../../common/decorators/user.decorator';


//Other
import { TokenValidationPipe } from '../../common/pipes/token-validation.pipe';
import { EmailValidationPipe } from '../../common/pipes/email-validation.pipe';
import { LocalAuthGuard } from '../../core/security/guards/local-auth.guard';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';
import { ApiGetMe } from './decorators/api-get-me.decorator';
import type { AccessTokenPayload } from '../..//common/types/access-token-payload.type';
import { AccessAuthGuard } from '../..//core/security/guards/access-auth.guard';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import { ApiRefresh } from '../../common/decorators/refresh-token.decorator';

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

  @Post('login')
  @ApiLogin()
  @UseGuards(LocalAuthGuard)
  async login(
    @User() user: UserPayload,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {

    return await this.authService.login(res, user);
  }

  @Get('me')
  @ApiGetMe()
  @UseGuards(AccessAuthGuard)
  async me(@AccessToken() accessTokenPayload: AccessTokenPayload): Promise<any> {
    console.log("AuthController: Fetching current user payload...");
    console.log(accessTokenPayload);
    return accessTokenPayload;
  }


  @Post('resend-verification')
  @ApiResendVerificationEmail()
  async resendVerification(@Body(EmailValidationPipe) resendVerificationTokenDto: ResendVerificationEmailDto ) {
    const { email } = resendVerificationTokenDto;
    console.log('Received resend verification request for email:', email);

    return await this.authService.resendVerification(email);
  }

  @Post('/refresh')
  @ApiRefresh()
  async refreshToken(@Req() req: Request,@Res({ passthrough: true }) res: Response): Promise<any> {

  //@UseGuards(RefreshAuthGuard) // Use the custom refresh token guard
  //async refreshToken(@Req() req: Request,@Res({ passthrough: true }) res: Response): Promise<any> {
   // const jwtPayload = req.user as any; // The RefreshStrategy will attach the user payload here

    //console.log("jwt payload: " + JSON.stringify(jwtPayload));
    //return this.authService.refreshTokens(req, res, jwtPayload);
  // Use the cookie name you set, e.g., 'refreshToken'
  const refreshToken = req.cookies['refreshToken']; 
  console.log("Cookie received:", refreshToken);
  
  return { message: "Refresh token retrieved from cookie" };  }

  
}
  