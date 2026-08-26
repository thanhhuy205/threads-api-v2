import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';

async function main() {
  const app = await NestFactory.create(AuthServiceModule);
  await app.listen(process.env.AUTH_SERVICE_PORT ?? 3003);
}

void main();
