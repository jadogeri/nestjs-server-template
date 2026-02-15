// 1. NestJS & Third-Party Libs
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

// 2. Feature Modules (Your Business Logic)
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';

// 3. Configurations
import dataSourceOptions from './configs/type-orm.config';
import { pinoLoggerConfig } from './configs/pino.config';

@Module({
  imports: [
    UserModule, 
    SessionModule, 
    AuthModule, 
    ProfileModule, 
    RoleModule, 
    ContactModule, 
    PermissionModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    LoggerModule.forRoot(pinoLoggerConfig),

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
