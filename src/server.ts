import app from '@/app';
import { autoRemoveBanProducer } from '@/modules/job/auto-remove-ban/producer/auto-remove-ban.producer';
import { deltaProducer } from '@/modules/job/delta-hp-cron/producer/delta-producer';
import { likeProducer } from '@/modules/job/like-job/producer/like.producer';
import { notificationProducer } from '@/modules/job/notification-job/producer/notification.producer';
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

    try {
        await autoRemoveBanProducer.initAutoRemoveBanJob();
        console.log('Initialized auto-remove-ban repeat job');
    } catch (error) {
        console.error('Failed to initialize auto-remove-ban repeat job:', error);
    }

    try {
        await notificationProducer.initSyncNotificationBatchJob();
        console.log('Initialized notification batch repeat job');
    } catch (error) {
        console.error('Failed to initialize notification batch repeat job:', error);
    }

    try {
        await notificationProducer.initMessageNotificationJob();
        console.log('Initialized message notification repeat job');
    } catch (error) {
        console.error('Failed to initialize message notification repeat job:', error);
    }

    try {
        await deltaProducer.initSyncBatchJob();
        console.log('Initialized delta hp repeat job');
    }
    catch (error) {
        console.error('Failed to initialize delta hp repeat job:', error);
    }

    process.on('SIGINT', () => {
        shutdown('SIGINT');
    });

    process.on('SIGTERM', () => {
        shutdown('SIGTERM');
    });
};

void bootstrap();
