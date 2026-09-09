import { APP_CONFIG } from '@user-service/config/app.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: require.resolve('@purse-board/proto/user.proto'),
      url: '0.0.0.0:5001',
    },
  });
  await app.startAllMicroservices();
  await app.listen(APP_CONFIG.USER_SERVICE_PORT, APP_CONFIG.USER_SERVICE_HOST);
}

void bootstrap();
