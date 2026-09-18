import './instrumentation';

import { NestFactory } from '@nestjs/core';
import { PinoNestLogger } from '@purse/observability/logging';
import { AppModule } from './app.module';
import { APP_CONFIG } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoNestLogger));
  app.setGlobalPrefix('api/v1');
  await app.listen(
    APP_CONFIG.POST_SERVICE_PORT,
    APP_CONFIG.POST_SERVICE_HOST,
  );
}

void bootstrap();
