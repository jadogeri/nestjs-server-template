import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [UserModule, SessionModule, AuthModule, ProfileModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
