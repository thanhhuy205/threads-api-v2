import { registerAs } from '@nestjs/config';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

const numberFromEnv = (value: string | undefined, defaultValue: number): number =>
  value ? Number(value) : defaultValue;

export class KafkaConfiguration {
  @IsOptional()
  @IsString()
  KAFKA_BROKERS = process.env.KAFKA_BROKERS;

  @IsInt()
  @Min(1)
  KAFKA_HEARTBEAT_INTERVAL = numberFromEnv(process.env.KAFKA_HEARTBEAT_INTERVAL, 2000);

  @IsInt()
  @Min(1)
  KAFKA_SESSION_TIMEOUT = numberFromEnv(process.env.KAFKA_SESSION_TIMEOUT, 60000);

  @IsBoolean()
  KAFKA_SASL_ENABLED = process.env.KAFKA_SASL_ENABLED === 'true';

  @IsString()
  @IsIn(['plain', 'scram-sha-256', 'scram-sha-512'])
  KAFKA_SASL_MECHANISM = process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256';

  @IsString()
  KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME || 'root';

  @IsString()
  KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD || 'secret';
}

export const kafkaConfiguration = registerAs('kafka', () => ({}));