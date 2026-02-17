// 1. NestJS & Third-Party Libs
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

// 2. Feature Modules (Your Business Logic)
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { CoreModule } from './core/core.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';

// 3. Configurations
import dataSourceOptions from './configs/type-orm.config';
import { pinoLoggerConfig } from './configs/pino.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CoreModule, 
    UserModule, 
    SessionModule, 
    AuthModule, 
    ProfileModule, 
    RoleModule, 
    ContactModule, 
    PermissionModule,
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    LoggerModule.forRoot(pinoLoggerConfig),
    ConfigModule.forRoot({ isGlobal: true }),   

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
