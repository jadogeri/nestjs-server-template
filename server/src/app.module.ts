import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [UserModule, SessionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
