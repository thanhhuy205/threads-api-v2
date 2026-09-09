import { APP_CONFIG } from '@auth-service/config/app.config';
import { NestFactory } from '@nestjs/core';
import requestId from 'express-request-id';
import helmet from 'helmet';
import { AppModule } from './app.module';

// CORS_ORIGIN is a comma-separated whitelist. `*` (the default in
// libs/common/src/config/app.config.ts) keeps the old permissive behaviour so
// local dev still works, but any explicit value narrows it to that list —
// app.enableCors() with no argument reflects ANY origin, which combined with
// credentials would let any site call the API as a logged-in user.
function corsOrigin(): string[] | boolean {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw || raw === '*') return true;
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
}

async function bootstrap() {
  // const logger = WinstonModule.createLogger(getWinstonConfig(appName, nodeEnv));
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: corsOrigin(), credentials: true });
  app.use(requestId());


  await app.init();
  await app.listen(APP_CONFIG.AUTH_SERVICE_PORT, APP_CONFIG.AUTH_SERVICE_HOST);
}

void bootstrap();
