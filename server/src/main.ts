import { SentryConfig } from './configs/sentry.config';
SentryConfig();

import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
//configs
import { swaggerConfig } from './configs/swagger.config';
import { validationPipeConfig } from './configs/global-validation-pipe.config';
import { PaginationInterceptor } from './core/infrastructure/interceptors/pagination.interceptor';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { Logger } from 'nestjs-pino';


class Server {

  static async bootstrap() {
    const app = await NestFactory.create(AppModule);
    const document = SwaggerModule.createDocument(app, swaggerConfig);

    
    SwaggerModule.setup('docs', app, document ); 

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

    app.use(cookieParser()); // Add cookie parser middleware    
    app.enableCors(); // Essential for frontend-to-backend communication

  app.useGlobalInterceptors(new PaginationInterceptor());
  app.useGlobalFilters(new DatabaseExceptionFilter());

    await app.listen(process.env.PORT ?? 3000);
  }
}

Server.bootstrap();
