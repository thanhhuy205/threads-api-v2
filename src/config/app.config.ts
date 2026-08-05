import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class AppConfiguration {
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL: string;

  constructor() {
    this.PORT = process.env.PORT ? Number(process.env.PORT) : 3300;
    this.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
    this.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  }
}
