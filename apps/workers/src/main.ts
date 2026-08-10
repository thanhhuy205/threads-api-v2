import { NestFactory } from '@nestjs/core';
import { redisService } from '@libs/core/providers/redis.provider';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!redisService.isOpen) {
    await redisService.connect();
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const shutdown = async () => {
    await app.close();
    if (redisService.isOpen) {
      await redisService.disconnect();
    }
  };

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());
}

void bootstrap();
