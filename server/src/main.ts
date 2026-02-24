import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';

import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
//configs
import { swaggerConfig } from './configs/swagger.config';
import { validationPipeConfig } from './configs/global-validation-pipe.config';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';


class Server {

  static async bootstrap() {
    const app = await NestFactory.create(AppModule);
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    
    SwaggerModule.setup('docs', app, document ); // The documentation will be available at http://localhost:3000/docs

    app.useGlobalFilters(new TypeOrmExceptionFilter());
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

    app.use(cookieParser()); // Add cookie parser middleware    
    await app.listen(process.env.PORT ?? 3000);
  }
}

Server.bootstrap();
