import app from '@/app';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { AppModule } from '@/app.module';
import { BadRequestException, ValidationPipe, type ValidationError } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { likeProducer } from '@/modules/job/like-job/producer/like.producer';
import { notificationProducer } from '@/modules/job/notification-job/producer/notification.producer';
import { surveySyncProducer } from '@/modules/job/survey-sync/producer/survey-sync.producer';
import { closeMongoDB, connectMongoDB } from '@/providers/mongodb.provider';
import configService from './config/config';
import prisma from './config/prisma';
import { redisService } from './providers/redis.provider';
import { errorHandler } from './middlewares/error-handler';
import { notFoundHandler } from './middlewares/not-found';
import router from './routes/index';
import rateLimit from 'express-rate-limit';

const flattenValidationErrors = (
    errors: ValidationError[],
    parentPath = '',
): Array<{ path: string; message: string }> =>
    errors.flatMap((error) => {
        const path = parentPath ? `${parentPath}.${error.property}` : error.property;
        const current = Object.values(error.constraints ?? {}).map((message) => ({ path, message }));
        return [...current, ...flattenValidationErrors(error.children ?? [], path)];
    });

const createHttpApplication = async () => {
    const nestApp = await NestFactory.create(
        AppModule,
        new ExpressAdapter(app),
        { bodyParser: false },
    );

    app.use(`/${configService.GLOBAL_PREFIX}`, rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));

    nestApp.setGlobalPrefix(configService.GLOBAL_PREFIX);
    nestApp.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => new BadRequestException({
            message: 'Validation failed',
            errors: flattenValidationErrors(errors),
        }),
    }));
    nestApp.useGlobalInterceptors(new TransformInterceptor(nestApp.get(Reflector)));
    nestApp.useGlobalFilters(new HttpExceptionFilter());
    await nestApp.init();

    app.use(`/${configService.GLOBAL_PREFIX}`, router);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return nestApp;
};

const bootstrap = async () => {
    await createHttpApplication();
    try {
        await redisService.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        process.exit(1);
    }

    try {
        await connectMongoDB();
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }

    const server = app.listen(configService.APP_CONFIG.PORT, () => { });

    const shutdown = (signal: string) => {
        server.close((error) => {
            if (error) {
                process.exit(1);
            }

            void Promise.allSettled([
                prisma.$disconnect(),
                closeMongoDB().catch((err: unknown) => console.error('Failed to close MongoDB connection', err)),
                redisService.isOpen ? redisService.disconnect() : Promise.resolve(),
            ]).finally(() => {
                process.exit(0);
            });
        });
    };

    try {
        await likeProducer.initSyncJob();
    } catch (error) {
        console.error('Failed to initialize like sync repeat job:', error);
    }

    try {
        await notificationProducer.initSyncNotificationBatchJob();
    } catch (error) {
        console.error('Failed to initialize notification batch repeat job:', error);
    }

    try {
        await surveySyncProducer.initSyncSurveyJob();
    } catch (error) {
        console.error('Failed to initialize survey sync repeat job:', error);
    }

    process.on('SIGINT', () => {
        shutdown('SIGINT');
    });

    process.on('SIGTERM', () => {
        shutdown('SIGTERM');
    });
};

void bootstrap();
