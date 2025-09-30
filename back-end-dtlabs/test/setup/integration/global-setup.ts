import { PrismaClient } from '@prisma/client';

export default async function globalSetup() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$executeRaw`DELETE FROM "User" WHERE 1=1`;
  } finally {
    await prisma.$disconnect();
  }
}