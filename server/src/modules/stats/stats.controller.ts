// src/modules/stats/stats.controller.ts
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../core/security/guards/roles.guard';
import { PoliciesGuard } from '../../core/security/guards/policies.guard';
import { CacheMonitorInterceptor } from '../../core/infrastructure/interceptors/cache-monitor.interceptor';
import { AccessAuthGuard } from '../../core/security/guards/access-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';



@ApiExcludeController()
@SkipThrottle() // Exclude this controller from rate limiting
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

    @Get('contacts')
    getContactsDashboard() {
        return this.statsService.getContactStats();
    }
}
