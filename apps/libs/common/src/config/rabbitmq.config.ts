import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

export class RabbitMqConfiguration {
  @IsOptional()
  @IsString()
  RABBITMQ_URLS = process.env.RABBITMQ_URLS;
}

export const RABBITMQ_CONFIG = new RabbitMqConfiguration();

export const rabbitmqConfiguration = registerAs('rabbitmq', () => ({
  urls: RABBITMQ_CONFIG.RABBITMQ_URLS
    ? RABBITMQ_CONFIG.RABBITMQ_URLS.split(',').map((url) => url.trim()).filter(Boolean)
    : [],
}));
