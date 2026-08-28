import { IsOptional, IsString } from 'class-validator';

export class RabbitMqConfiguration {
  @IsOptional()
  @IsString()
  RABBITMQ_URLS = process.env.RABBITMQ_URLS;
}

export const RABBITMQ_CONFIG = new RabbitMqConfiguration();

