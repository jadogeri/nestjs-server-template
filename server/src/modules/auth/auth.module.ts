import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { Auth } from './entities/auth.entity';

// Other modules
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { SessionModule } from '../session/session.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { PayloadMapperService } from './payload-mapper.service';


@Module({
  imports: [ UserModule, RoleModule, SessionModule, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, PayloadMapperService],
  exports: [AuthService, AuthRepository, PayloadMapperService],
})
export class AuthModule {}

  

  