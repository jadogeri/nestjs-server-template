// src/modules/stats/stats.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiExcludeController()
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('role-distribution')
  getRoleDistribution() {
    return this.statsService.getRoleDistribution();
  }

  @Get('summary')
  getSummary() {
    return this.statsService.getGeneralStats();
  }
}
