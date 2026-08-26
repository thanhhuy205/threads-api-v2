import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';

async function main() {
  const app = await NestFactory.create(UserServiceModule);
  await app.listen(process.env.USER_SERVICE_PORT ?? 3006);
}

void main();
