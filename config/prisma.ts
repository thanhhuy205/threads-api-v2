import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import env from './env';

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

const adapter = new PrismaMariaDb(env.DATABASE_URL);

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });

if (env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;