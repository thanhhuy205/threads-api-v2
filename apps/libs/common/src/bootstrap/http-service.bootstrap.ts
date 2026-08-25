import { CONFIGURATION } from '@/config/configuration';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { BadRequestException, ValidationPipe, type Type, type ValidationError } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import morgan from 'morgan';

type HttpServiceOptions = {
  defaultPort: number;
  description: string;
  portEnvironmentVariable: string;
  title: string;
};

const flattenValidationErrors = (
  errors: ValidationError[],
  parentPath = '',
): Array<{ path: string; message: string }> =>
  errors.flatMap((error) => {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;
    const current = Object.values(error.constraints ?? {}).map((message) => ({ path, message }));
    return [...current, ...flattenValidationErrors(error.children ?? [], path)];
  });

export async function bootstrapHttpService(
  rootModule: Type<unknown>,
  options: HttpServiceOptions,
): Promise<void> {
  const app = await NestFactory.create(rootModule);
  const corsOrigin = CONFIGURATION.APP_CONFIG.CORS_ORIGIN === '*'
    ? '*'
    : CONFIGURATION.APP_CONFIG.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

  app.enableCors({ origin: corsOrigin });
  app.setGlobalPrefix(CONFIGURATION.GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => new BadRequestException({
      message: 'Validation failed',
      errors: flattenValidationErrors(errors),
    }),
  }));
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
        manifestSrc: ['apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: ['sandbox.embed.apollographql.com'],
      },
    },
  }));

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion('1.0.0')
    .addBearerAuth(undefined, 'bearer')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(process.env[options.portEnvironmentVariable] ?? options.defaultPort);
}
