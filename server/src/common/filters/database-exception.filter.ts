import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import * as winston from 'winston';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  // Configure Winston to save logs to a file
  private logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      new winston.transports.File({ filename: 'logs/database-errors.log', level: 'error' }),
    ],
  });

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const logEntry = {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      sql: exception.query, // Capture the SQL from your logs
      params: exception.parameters, // Capture the Parameters
      message: exception.message,
    };

    // Save to file
    this.logger.error(logEntry);

    // Return friendly message to user
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Database Query Failed',
      detail: exception.message.includes('UNIQUE') ? 'Duplicate entry found' : 'Constraint violation',
    });
  }
}
