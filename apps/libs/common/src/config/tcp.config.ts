import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

const optionalPort = (value: string | undefined): number | undefined =>
  value ? Number(value) : undefined;

export class TcpConfiguration {
  @IsOptional()
  @IsString()
  TCP_USER_SERVICE_HOST = process.env.TCP_USER_SERVICE_HOST;

  @IsOptional()
  @IsInt()
  @Min(1)
  TCP_USER_SERVICE_PORT = optionalPort(process.env.TCP_USER_SERVICE_PORT);

  @IsOptional()
  @IsString()
  TCP_NOTIFICATION_SERVICE_HOST = process.env.TCP_NOTIFICATION_SERVICE_HOST;

  @IsOptional()
  @IsInt()
  @Min(1)
  TCP_NOTIFICATION_SERVICE_PORT = optionalPort(process.env.TCP_NOTIFICATION_SERVICE_PORT);
}


