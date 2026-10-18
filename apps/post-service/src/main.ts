import './instrumentation';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoNestLogger } from '@purse/observability/logging';
import { AppModule } from './app.module';
import { APP_CONFIG } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoNestLogger));
  app.setGlobalPrefix('api/v1/feed');

  app.useGlobalInterceptors(app.get('TransformInterceptor'));

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

  await app.listen(
    APP_CONFIG.POST_SERVICE_PORT,
    APP_CONFIG.POST_SERVICE_HOST,
  );
}

void bootstrap();
