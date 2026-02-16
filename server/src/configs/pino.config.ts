import { Params } from 'nestjs-pino';
import { join } from 'node:path';

export const pinoLoggerConfig: Params = {
  pinoHttp: {
    // Redact sensitive fields for security
    redact: ['req.headers.authorization', 'body.password', 'body.token'],
    transport: {
      targets: [
        // 1. Console Transport (Readable/Pretty)
        {
          target: 'pino-pretty',
          level: 'info',
          options: { 
            colorize: true,
            translateTime: 'SYS:standard'
          },
        },
        // 2. File Transport with Auto-Rotation (Asynchronous & Non-blocking)
        {
          target: 'pino-roll',
          level: 'info',
          options: {
            file: join(process.cwd(), 'logs', 'http.log'),
            frequency: 'daily',
            size: '10m',
            mkdir: true,
          },
        },
        {          
          target: 'pino/file',
          level: 'error',
          options: { destination: './logs/database-errors.log', mkdir: true },
        },
      ],
    },
  },
};
