import { Controller, Get, Injectable, Module } from '@nestjs/common';

@Injectable()
class HealthService {
  get() {
    const uptime = process.uptime();
    return {
      message: 'server is running...',
      uptime,
    };
  }
}

@Controller('health')
class HealthController {
  constructor(private healthService: HealthService) {}
  @Get()
  get() {
    return this.healthService.get();
  }
}

@Module({
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
