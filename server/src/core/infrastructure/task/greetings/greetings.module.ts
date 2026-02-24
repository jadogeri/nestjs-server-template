// greetings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GreetingService } from './greetings.service';
import { Auth } from '../../../../modules/auth/entities/auth.entity';

@Module({
  imports: [
    // Register the entity so the Repository can be injected
    TypeOrmModule.forFeature([Auth]),
  ],
  providers: [GreetingService],
  exports: [GreetingService],
})
export class GreetingModule {}
