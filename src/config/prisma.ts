import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import configService from './config';

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

const adapter = new PrismaMariaDb(configService.DATABASE_URL);

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: configService.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });

if (configService.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;