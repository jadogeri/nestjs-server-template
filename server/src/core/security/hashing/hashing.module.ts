import { Module } from '@nestjs/common';
import { Argon2Service } from './argon2.service';
import { HashingService } from './interfaces/hashing.service';


@Module({
providers: [
    {
      provide: HashingService, // The abstract token
      useClass: Argon2Service, // The professional implementation
    },
  ],
  exports: [HashingService],
})
export class HashingModule {} //module
