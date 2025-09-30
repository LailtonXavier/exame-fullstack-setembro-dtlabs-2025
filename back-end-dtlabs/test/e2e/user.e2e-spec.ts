import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/server/app.module';

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let userId: string;
  let userEmail: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const plainPassword = '123456';
    const hashed = await bcrypt.hash(plainPassword, 10);

    userEmail = `test+${Date.now()}@test.com`;
    const created = await prisma.user.create({
      data: {
        name: 'Test User',
        email: userEmail,
        password: hashed,
      },
    });

    userId = created.id;

    token = jwt.sign(
      { sub: userId, email: userEmail },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );

    if (!token) throw new Error('Failed to create JWT token in test setup');
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('/users (POST) should create a user', async () => {
    const uniqueEmail = `lailton+${Date.now()}@example.com`;
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Lailton Xavier', email: uniqueEmail, password: '123456' });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Lailton Xavier');

    const userInDb = await prisma.user.findUnique({
      where: { email: uniqueEmail },
    });

    expect(userInDb).not.toBeNull();
  });

  it('should update own account', async () => {
    const res = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should forbid updating another account', async () => {
    const otherId = 'asdfasdf-fsdfsd-sdfsdf'

    const res = await request(app.getHttpServer())
      .put(`/users/${otherId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Hacker' });

    expect(res.status).toBe(403);
  });

  it('should return 400 for invalid email', async () => {
    const res = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
  });

  it('should verify token is valid for a protected endpoint', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200)
  });
});
