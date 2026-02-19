// 1. NestJS & Third-Party Libs
import { Module } from '@nestjs/common';

// 2 modules
import { AccessControlModule } from './access-control/access-control.module';
import { CookieModule } from './cookie/cookie.module';
import { HashingModule } from './hashing/hashing.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [HashingModule, TokenModule, AccessControlModule,  CookieModule], 
  exports: [HashingModule, TokenModule, AccessControlModule, CookieModule],  
  providers: [],
})
export class SecurityModule {}
