import { Module } from '@nestjs/common';
import { HashingService } from './hash.service';

@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}

    