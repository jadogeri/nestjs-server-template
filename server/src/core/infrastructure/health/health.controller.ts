
 import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheckService, 
  HttpHealthIndicator, 
  HealthCheck, 
  TypeOrmHealthIndicator, 
  DiskHealthIndicator, 
  MemoryHealthIndicator
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    private readonly diskPath = process.platform === 'win32' ? 'C:\\' : '/';

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    

  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
      () => this.disk.checkStorage('storage', { path: this.diskPath, thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
    ]);
  }
}
