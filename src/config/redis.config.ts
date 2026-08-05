import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class RedisConfiguration {
  @IsString()
  @IsNotEmpty()
  @Matches(/^rediss?:\/\//, { message: 'REDIS_URL must use redis:// or rediss://' })
  REDIS_URL = process.env.REDIS_URL || '';

  @IsString()
  REDIS_HOST = process.env.REDIS_HOST || '';

  @IsInt()
  @Min(1)
  REDIS_PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD = process.env.REDIS_PASSWORD;
}
