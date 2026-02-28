// src/core/security/security.module.ts
import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { SessionCleanupModule } from './task/session-cleanup/session-cleanup.module';
import { GreetingModule } from './task/greetings/greetings.module';
import { HealthModule } from './health/health.module';


@Module({
  imports: [MailModule, SessionCleanupModule, GreetingModule, HealthModule], // Import sub-modules
  exports: [MailModule, SessionCleanupModule, GreetingModule, HealthModule], // Export services for use in other modules
  providers: [],
})
export class InfrastructureModule {}
