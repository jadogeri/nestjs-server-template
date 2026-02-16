// 1. NestJS & Framework Imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

// 2. Services (Logic Layer)
import { AuthService } from './auth.service';
import { PayloadMapperService } from './payload-mapper.service';

// 3. Controllers (Presentation Layer)
import { AuthController } from './auth.controller';

// Repositories & Entities
import { AuthRepository } from './auth.repository';
import { Auth } from './entities/auth.entity';

// modules
import { SessionModule } from '../session/session.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

// Strategies
import { LocalStrategy } from './strategies/local.strategy';


@Module({
  imports: [ UserModule, RoleModule, SessionModule, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, PayloadMapperService, LocalStrategy],
  exports: [AuthService, AuthRepository, PayloadMapperService],
})
export class AuthModule {}

  

  