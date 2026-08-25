import { NestFactory } from '@nestjs/core';
import { WorkServiceModule } from './work-service.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkServiceModule);
  const shutdown = async () => app.close();

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());
}

void bootstrap();
