import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHello(@Res({ passthrough: true }) res, @Req() req): object {
    return this.appService.getHealth();
  }
}
