import env from '../../config/env';
import prisma from '../../config/prisma';

export const buildHealthPayload = () => ({
    success: true,
    service: 'threads-api-v2',
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
});

export const checkDatabaseConnection = async () => {
    await prisma.$queryRaw`SELECT 1`;

    return {
        database: 'connected',
    };
};