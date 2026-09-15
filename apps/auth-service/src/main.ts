import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import requestId from 'express-request-id';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { APP_CONFIG } from './config/app.config';

function corsOrigin(): string[] | boolean {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw || raw === '*') return true;
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: corsOrigin(), credentials: true });
  app.use(requestId());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: require.resolve('@purse/proto/user.proto'),
      url: '0.0.0.0:5001',
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.startAllMicroservices();
  await app.listen(APP_CONFIG.AUTH_SERVICE_PORT, APP_CONFIG.AUTH_SERVICE_HOST);
}

void bootstrap();
