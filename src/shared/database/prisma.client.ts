import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { CONFIGURATION } from '@/config/configuration';

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const database = CONFIGURATION.DATABASE_CONFIG;

const adapter = new PrismaMariaDb({
  host: database.DB_HOST,
  port: database.DB_PORT,
  user: database.DB_USER,
  password: database.DB_PASSWORD,
  database: database.DB_NAME,
  connectionLimit: database.CONNECTION_LIMIT,
  connectTimeout: database.CONNECTION_TIMEOUT,
  idleTimeout: database.IDLE_TIMEOUT,
});

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: CONFIGURATION.IS_DEV ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

if (CONFIGURATION.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
