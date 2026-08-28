import { APP_CONFIG } from '@auth-service/config/app.config';
import { NestFactory } from '@nestjs/core';
import requestId from 'express-request-id';
import helmet from 'helmet';
import { AppModule } from './app.module';
async function bootstrap() {
  // const logger = WinstonModule.createLogger(getWinstonConfig(appName, nodeEnv));
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.use(requestId());


  await app.init();
  await app.listen(APP_CONFIG.AUTH_SERVICE_PORT);
}

void bootstrap();
