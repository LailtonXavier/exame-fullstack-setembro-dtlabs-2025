import { Test, TestingModule } from '@nestjs/testing';
import { JwtApplicationService } from '@/core/auth/application/services/jwt-application.service';
import { JwtService } from '@/core/auth/application/services/jwt.service';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AuthModule } from '@/core/auth/auth.module';
import { UserModule } from '@/core/user/user.module';

export interface AuthTestDependencies {
  jwtApplicationService: JwtApplicationService;
  jwtService: JwtService;
  encryptionService: EncryptionService;
  prisma: PrismaService;
  module: TestingModule;
}

export async function createAuthTestingModule() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      AuthModule,
      UserModule,
    ],
  }).compile();

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