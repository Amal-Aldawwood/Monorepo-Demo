import { PrismaClient } from '@prisma/client';

// Use a singleton pattern to prevent multiple Prisma Client instances
let prismaClient: PrismaClient | undefined;

export const getPrismaClient = () => {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
};

export const db = getPrismaClient();

// Export services
export * from './services';
