import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

export class RabbitMqConfiguration {
  @IsOptional()
  @IsString()
  RABBITMQ_URLS = process.env.RABBITMQ_URLS;
}


export const rabbitmqConfiguration = registerAs('rabbitmq', () => ({}));