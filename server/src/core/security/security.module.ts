// 1. NestJS & Third-Party Libs
import { Module } from '@nestjs/common';
import { HashingModule } from './hashing/hashing.module';
import { TokenModule } from './token/token.module';


@Module({
  imports: [HashingModule, TokenModule], 
  exports: [HashingModule, TokenModule], 
  providers: [],
})
export class SecurityModule {}
