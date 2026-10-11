import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Lab04 (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(res.body.message).toBe('¡Hola desde Docker!');
    expect(res.body.hostname).toBeDefined();
  });

  it('GET /health', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /math/sum?a=2&b=3', async () => {
    const res = await request(app.getHttpServer())
      .get('/math/sum?a=2&b=3')
      .expect(200);
    expect(res.body).toEqual({ operation: 'sum', a: 2, b: 3, result: 5 });
  });

  it('GET /math/divide con b=0 devuelve 400', () => {
    return request(app.getHttpServer())
      .get('/math/divide?a=1&b=0')
      .expect(400);
  });

  it('GET /math/multiply con parámetros inválidos devuelve 400', () => {
    return request(app.getHttpServer())
      .get('/math/multiply?a=x&b=2')
      .expect(400);
  });
});
