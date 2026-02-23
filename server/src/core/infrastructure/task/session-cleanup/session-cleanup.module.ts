// session-cleanup.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../../../../modules/session/entities/session.entity';
import { SessionCleanupService } from './session-cleanup.service';

@Module({
  imports: [
    // Register the entity so the Repository can be injected
    TypeOrmModule.forFeature([Session]),
  ],
  providers: [SessionCleanupService],
  exports: [SessionCleanupService],
})
export class SessionCleanupModule {}
