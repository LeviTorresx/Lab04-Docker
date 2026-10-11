import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('GET / devuelve el saludo con hostname y timestamp', () => {
    const res = appController.getHello();
    expect(res.message).toBe('¡Hola desde Docker!');
    expect(typeof res.hostname).toBe('string');
    expect(Number.isNaN(Date.parse(res.timestamp))).toBe(false);
  });

  it('GET /health devuelve status ok', () => {
    expect(appController.getHealth().status).toBe('ok');
  });
});
