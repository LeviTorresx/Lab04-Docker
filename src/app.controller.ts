import { Controller, Get } from '@nestjs/common';
import {
  AppService,
  type GreetingResponse,
  type HealthResponse,
} from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): GreetingResponse {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }
}
