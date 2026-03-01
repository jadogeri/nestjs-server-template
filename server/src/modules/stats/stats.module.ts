// src/modules/stats/stats.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { Contact } from '../contact/entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Contact])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
