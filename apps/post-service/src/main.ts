import { NestFactory } from '@nestjs/core';
import { APP_CONFIG } from '@post-service/config/app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(
    APP_CONFIG.POST_SERVICE_PORT,
    APP_CONFIG.POST_SERVICE_HOST,
  );
}

void bootstrap();
