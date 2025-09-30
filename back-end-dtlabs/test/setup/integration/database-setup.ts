import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class DatabaseTestSetup implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.cleanDatabase();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async cleanDatabase() {
    const tables = ['User'];
    
    for (const table of tables) {
      await this.prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
    }
  }

  async createUser(userData: {
    id?: string;
    name: string;
    email: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data: {
        id: userData.id || `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
    });
  }
}