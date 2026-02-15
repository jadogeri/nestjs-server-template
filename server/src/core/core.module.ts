import { Module, Global } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';


@Global() // Optional: Makes Core services available everywhere
@Module({
  imports: [
    SecurityModule,
    InfrastructureModule, 
  ],
  exports: [
    SecurityModule,
    InfrastructureModule,
  ], 
  controllers: [],
  providers: [],
})
export class CoreModule {}

  