// src/common/filters/typeorm-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DatabaseError');

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // 1. LOG TO FILE (Detailed)
    this.logger.error({
      message: 'Database Query Failed',
      sql: exception.query,      // The raw SQL
      params: exception.parameters, // The input data
      detail: (exception as any).detail, // DB-specific error (e.g., PG detail)
      url: request.url,
    });

    // 2. SEND TO USER (Clean)
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'A database error occurred. Our team has been notified.',
      error: 'Internal Server Error',
    });
  }
}
