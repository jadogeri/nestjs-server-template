import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { ContactModule } from './modules/contact/contact.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [UserModule, SessionModule, AuthModule, ProfileModule, RoleModule, ContactModule, PermissionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
