// greetings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GreetingService } from './greetings.service';
import { Auth } from '../../../../modules/auth/entities/auth.entity';
import { GreetingsEventListener } from '../../mail/listener/greetings.listener';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(), 

    // Register the entity so the Repository can be injected
    TypeOrmModule.forFeature([Auth]),
  ],
  providers: [GreetingService, GreetingsEventListener],
  exports: [GreetingService, GreetingsEventListener], // Export the service if it needs to be used elsewhere
})
export class GreetingModule {}

