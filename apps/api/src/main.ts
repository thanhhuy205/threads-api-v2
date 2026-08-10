import { BadRequestException, ValidationPipe, type ValidationError } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import configService from '@/config/config';
import { LikeProducer } from './modules/job/like-job/producer/like.producer';
import { NotificationProducer } from './modules/job/notification-job/producer/notification.producer';
import { SurveySyncProducer } from './modules/job/survey-sync/producer/survey-sync.producer';
import { closeMongoDB, connectMongoDB } from '@/providers/mongodb.provider';
import { redisService } from '@/providers/redis.provider';
import { PrismaService } from '@libs/database';

const corsOrigin =
  configService.APP_CONFIG.CORS_ORIGIN === '*'
    ? '*'
    : configService.APP_CONFIG.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

const flattenValidationErrors = (
  errors: ValidationError[],
  parentPath = '',
): Array<{ path: string; message: string }> =>
  errors.flatMap((error) => {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;
    const current = Object.values(error.constraints ?? {}).map((message) => ({ path, message }));
    return [...current, ...flattenValidationErrors(error.children ?? [], path)];
  });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  const likeProducer = app.get(LikeProducer);
  const notificationProducer = app.get(NotificationProducer);
  const surveySyncProducer = app.get(SurveySyncProducer);

  app.enableCors({ origin: corsOrigin });
  app.setGlobalPrefix(configService.GLOBAL_PREFIX);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Threads API')
    .setDescription('Authentication API documentation')
    .setVersion('1.0.0')
    .addBearerAuth(undefined, 'bearer')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => new BadRequestException({
      message: 'Validation failed',
      errors: flattenValidationErrors(errors),
    }),
  }));

  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  }));

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  await redisService.connect();
  await connectMongoDB();

  await Promise.all([
    likeProducer.initSyncJob(),
    notificationProducer.initSyncNotificationBatchJob(),
    surveySyncProducer.initSyncSurveyJob(),
  ]);

  const shutdown = async () => {
    await app.close();
    await Promise.allSettled([
      prismaService.$disconnect(),
      closeMongoDB(),
      redisService.isOpen ? redisService.disconnect() : Promise.resolve(),
    ]);
  };

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  // 2. Start the HTTP server listening on a defined port.
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
