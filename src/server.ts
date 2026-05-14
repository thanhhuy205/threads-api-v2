import app from '@/app';
import { likeProducer } from '@/modules/job/like-job/producer/like.producer';
import configService from './config/config';
import prisma from './config/prisma';
import { redisService } from './providers/redis.provider';

const bootstrap = async () => {
    try {
        await redisService.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        process.exit(1);
    }

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

    try {
        await likeProducer.initSyncJob();
        console.log('Initialized like sync repeat job');
    } catch (error) {
        console.error('Failed to initialize like sync repeat job:', error);
    }

    process.on('SIGINT', () => {
        shutdown('SIGINT');
    });

    process.on('SIGTERM', () => {
        shutdown('SIGTERM');
    });
};

void bootstrap();
