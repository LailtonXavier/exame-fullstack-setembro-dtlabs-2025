import { Test, TestingModule } from '@nestjs/testing';
import { JwtApplicationService } from '@/core/auth/application/services/jwt-application.service';
import { JwtService } from '@/core/auth/application/services/jwt.service';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AuthModule } from '@/core/auth/auth.module';
import { UserModule } from '@/core/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';

export interface AuthTestDependencies {
  jwtApplicationService: JwtApplicationService;
  jwtService: JwtService;
  encryptionService: EncryptionService;
  prisma: PrismaService;
  module: TestingModule;
}

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

export async function createAuthTestingModule() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
      AuthModule,
      UserModule,
      PrismaModule, // ✅ Adicione o módulo que exporta PrismaService
    ],
  }).compile();

  await module.init(); // inicializa corretamente o módulo

  return {
    jwtApplicationService: module.get<JwtApplicationService>(JwtApplicationService),
    jwtService: module.get<JwtService>(JwtService),
    encryptionService: module.get<EncryptionService>(EncryptionService),
    prisma: module.get<PrismaService>(PrismaService),
    module,
  };
}

export const authTestData = {
  validRegister: () => ({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'validPassword123',
  }),
  
  validLogin: () => ({
    email: `login${Date.now()}@example.com`,
    password: 'validPassword123',
  }),
  
  invalidLogin: () => ({
    email: 'nonexistent@example.com',
    password: 'wrongpassword',
  }),
};