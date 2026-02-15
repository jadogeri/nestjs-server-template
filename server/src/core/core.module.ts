import { Module, Global } from '@nestjs/common';
import { SecurityModule } from './security/security.module';


@Global() // Optional: Makes Core services available everywhere
@Module({
  imports: [
    SecurityModule,
  ],
  exports: [
    SecurityModule,
  ], 
  controllers: [],
  providers: [],
})
export class CoreModule {}

  