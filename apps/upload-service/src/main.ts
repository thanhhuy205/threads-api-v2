import { NestFactory } from '@nestjs/core';
import { UploadServiceModule } from './upload-service.module';

async function bootstrap() {
  const app = await NestFactory.create(UploadServiceModule);
  await app.listen(process.env.UPLOAD_SERVICE_PORT ?? 3001);
}
void bootstrap();
