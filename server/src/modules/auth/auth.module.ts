// 1. NestJS & Framework Imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

// 2. Services (Logic Layer)
import { Argon2Service } from 'src/core/security/hashing/argon2.service';
import { AuthService } from './auth.service';
import { CookieService } from '../../core/security/cookie/cookie.service';
import { PayloadMapperService } from './payload-mapper.service';

// 3. Controllers (Presentation Layer)
import { AuthController } from './auth.controller';

// Repositories & Entities
import { AuthRepository } from './auth.repository';
import { Auth } from './entities/auth.entity';

// modules
import { HashingModule } from 'src/core/security/hashing/hashing.module';
import { RoleModule } from '../role/role.module';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';

// Strategies
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';


@Module({
  imports: [ UserModule, RoleModule, SessionModule,HashingModule, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AuthRepository, 
    PayloadMapperService, 
    Argon2Service, 
    CookieService, 
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService, AuthRepository, PayloadMapperService],

})
export class AuthModule {}
  
