import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { EncryptionService } from '@/core/auth/application/services/encryption.service';
import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { PrismaUserRepository } from '@/core/user/infra/prisma/repositories/prisma-user.repository';

export interface UserTestDependencies {
  prisma: PrismaService;
  encryptionService: EncryptionService;
  userRepository: UserRepository;
}

export async function createUserTestingModule(additionalProviders: any[] = []) {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PrismaService,
      EncryptionService,
      {
        provide: UserRepository,
        useClass: PrismaUserRepository,
      },
      ...additionalProviders,
    ],
  }).compile();

  return {
    prisma: module.get<PrismaService>(PrismaService),
    encryptionService: module.get<EncryptionService>(EncryptionService),
    userRepository: module.get<UserRepository>(UserRepository),
    module,
  };
}

export const userTestData = {
  createValidUser: () => ({
    id: 'user-123',
    name: 'Lailton',
    email: 'lailton@example.com',
    password: 'password123',
  }),

  createDataUser: () => ({
    name: 'Lailton',
    email: 'lailton@example.com',
    password: 'password123',
  }),
  
  createAnotherUser: () => ({
    id: 'user-456', 
    name: 'Another User',
    email: 'another@example.com',
    password: 'password123',
  }),
};