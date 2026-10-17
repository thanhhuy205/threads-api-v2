import './instrumentation';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoNestLogger } from '@purse/observability/logging';
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
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(PinoNestLogger));

  app.setGlobalPrefix('api/v1/auth');
  app.use(helmet());
  app.enableCors({ origin: corsOrigin(), credentials: true });
  app.useGlobalInterceptors(app.get('TransformInterceptor'));


  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'user',
  //     protoPath: require.resolve('@purse/proto/user.proto'),
  //     url: '0.0.0.0:5001',
  //     loader: {ban
  //       keepCase: false,
  //       defaults: true,
  //     },
  //   },
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Microservices API')
    .setDescription('Public API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = () =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    yamlDocumentUrl: '/openapi.yaml',
  });
  await app.startAllMicroservices();
  await app.listen(APP_CONFIG.ACCOUNT_SERVICE_PORT, APP_CONFIG.ACCOUNT_SERVICE_HOST);
}

void bootstrap();
