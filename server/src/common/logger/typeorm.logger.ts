import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TypeOrmPinoLogger implements TypeOrmLogger {
  // Use NestJS built-in Logger which points to Pino if configured in main.ts
  private readonly logger = new Logger('SQL');

  /**
   * Logs queries that failed during execution.
   */
  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error({
      msg: 'Database Query Failed',
      error: typeof error === 'string' ? error : error.message,
      query,
      parameters,
    });
  }

  /**
   * Logs queries that run slower than the threshold (maxQueryExecutionTime).
   */
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn({
      msg: 'Slow Query Detected',
      executionTime: `${time}ms`,
      query,
      parameters,
    });
  }

  /**
   * Logs schema sync messages (Migrations, etc).
   */
  logSchemaBuild(message: string) {
    this.logger.log(`Schema Build: ${message}`);
  }

  /**
   * Logs general database messages.
   */
  log(level: 'log' | 'info' | 'warn', message: any) {
    if (level === 'warn') return this.logger.warn(message);
    this.logger.log(message);
  }

  /**
   * Optional: Logs every single query (Usually disabled in production).
   */
  logQuery(query: string, parameters?: any[]) {
    // Only log if you really need to see everything during debugging
    this.logger.debug({ query, parameters });
  }

  /**
   * Logs migrations activity.
   */
  logMigration(message: string) {
    this.logger.log(`Migration: ${message}`);
  }
}
