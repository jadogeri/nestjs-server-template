// src/core/security/security.module.ts
import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { SessionCleanupModule } from './task/session-cleanup/session-cleanup.module';


@Module({
  imports: [MailModule, SessionCleanupModule],
  exports: [MailModule, SessionCleanupModule,], // Export services for use in other modules
  providers: [],
})
export class InfrastructureModule {}
