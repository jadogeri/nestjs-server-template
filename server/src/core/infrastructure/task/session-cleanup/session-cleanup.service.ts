// token-cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/modules/session/entities/session.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  // This task runs every day at midnight
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCleanup() {
    console.log('Session cleanup task is currently active..................');
    
    this.logger.log('Running session cleanup task...');
    this.logger.debug('Starting expired token cleanup...');

    const result = await this.sessionRepository
      .createQueryBuilder()
      .delete()
      //#TODO replace  commented line with the line below after testing
      //.where('expiresAt < :now', { now: new Date() }) //
      .where("expiresAt < datetime('now', '-2 minutes')")

      .execute();

    this.logger.debug(`Cleanup complete. Removed ${result.affected} expired tokens.`);

    
  }
}
