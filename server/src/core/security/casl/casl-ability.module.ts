// src/casl/casl.module.ts
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.service';

@Module({
  providers: [CaslAbilityFactory], 
  exports: [CaslAbilityFactory]// Export to use in other modules
})
export class CaslModule {}
