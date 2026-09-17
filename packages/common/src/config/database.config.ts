import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class DatabaseConfiguration {
  @IsString()
  @IsNotEmpty()
  DB_HOST = process.env.DB_HOST || '';

  @IsInt()
  @Min(1)
  DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  @IsString()
  @IsNotEmpty()
  DB_USER = process.env.DB_USER || '';

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD = process.env.DB_PASSWORD || '';

  @IsString()
  @IsNotEmpty()
  DB_NAME = process.env.DB_NAME || '';

  @IsInt()
  @Min(1)
  CONNECTION_LIMIT = process.env.CONNECTION_LIMIT ? Number(process.env.CONNECTION_LIMIT) : 20;

  @IsInt()
  @Min(1)
  CONNECTION_TIMEOUT = process.env.CONNECTION_TIMEOUT ? Number(process.env.CONNECTION_TIMEOUT) : 5000;

  @IsInt()
  @Min(1)
  IDLE_TIMEOUT = process.env.IDLE_TIMEOUT ? Number(process.env.IDLE_TIMEOUT) : 300;
}
