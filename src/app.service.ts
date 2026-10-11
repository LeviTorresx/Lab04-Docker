import { Injectable } from '@nestjs/common';
import { hostname } from 'node:os';

export interface GreetingResponse {
  message: string;
  hostname: string;
  timestamp: string;
}

export interface HealthResponse {
  status: 'ok';
  uptime: number;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHello(): GreetingResponse {
    return {
      message: '¡Hola desde Docker!',
      hostname: hostname(),
      timestamp: new Date().toISOString(),
    };
  }

  getHealth(): HealthResponse {
    return {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
