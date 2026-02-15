// 1. NestJS & Third-Party Libs
import { Module } from '@nestjs/common';
import { HashingModule } from './hash/hash.module';


@Module({
  imports: [HashingModule],
  exports: [HashingModule], 
  providers: [],
})
export class SecurityModule {}
