import app from '@/app';
import configService from './config/config';
import prisma from './config/prisma';
import { redisService } from './providers/redis.provider';


const server = app.listen(configService.PORT, () => {
    console.log(`Server is running on http://localhost:${configService.PORT}`);
    console.log(`Swagger docs available at http://localhost:${configService.PORT}/api/v1/docs`);
});

const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing server...`);

    server.close((error) => {
        if (error) {
            process.exit(1);
        }

        void Promise.allSettled([
            prisma.$disconnect(),
            redisService.isOpen ? redisService.disconnect() : Promise.resolve(),
        ]).finally(() => {
            process.exit(0);
        });
    });
};

process.on('SIGINT', () => {
    shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    shutdown('SIGTERM');
});