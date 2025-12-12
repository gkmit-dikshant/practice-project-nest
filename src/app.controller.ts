import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @HttpCode(201)
  getHello(@Res({ passthrough: true }) res, @Req() req): object {
    console.log(req);
    return this.appService.getHealth();
  }
}
