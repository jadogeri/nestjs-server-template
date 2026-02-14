import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, SessionModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
