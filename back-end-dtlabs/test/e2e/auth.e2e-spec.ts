import { AppModule } from '@/infra/server/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';


describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) → 201 Created', async () => {
    const email = `test-${Date.now()}@example.com`;
  
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email,
        password: '123456',
      })
      .expect(201);
  
    expect(res.body.tokens).toHaveProperty('accessToken');
    expect(res.body.user).toMatchObject({
      name: 'Test User',
      email,
    });
  });  

  it('/auth/login (POST) → 200 OK', async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = '123456';
  
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email,
        password,
      })
      .expect(201);
  
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
  
    expect(res.body).toHaveProperty('accessToken');
  });
  

  it('/auth/login (POST) → 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpass',
      })
      .expect(401);
  });
});
