import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getAppVersion(): { version: string } {
    return { version: '0.0.1' };
  }
}
