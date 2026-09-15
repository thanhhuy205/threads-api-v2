import { MicroserviceName } from '@purse/core/microservice';
import { plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min, validateSync } from 'class-validator';

export class AppConfig {
  @IsString()
  MICROSERVICE_NAME: MicroserviceName;

  @IsString()
  @IsNotEmpty()
  POST_SERVICE_HOST: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  POST_SERVICE_PORT: number;

  constructor() {
    this.MICROSERVICE_NAME = MicroserviceName.PostService;
    this.POST_SERVICE_HOST = process.env.POST_SERVICE_HOST ?? '0.0.0.0';
    this.POST_SERVICE_PORT = Number(process.env.POST_SERVICE_PORT ?? 3004);
  }
}

export function validate(config: Record<string, unknown>): AppConfig {
  const validatedConfig = plainToInstance(AppConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export const APP_CONFIG = new AppConfig();
