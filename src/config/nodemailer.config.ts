import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { toBoolean } from './base.config';

export class NodemailerConfiguration {
  @IsString()
  @IsNotEmpty()
  NODEMAILER_HOST = process.env.NODEMAILER_HOST || '';

  @IsInt()
  @Min(1)
  NODEMAILER_PORT = process.env.NODEMAILER_PORT ? Number(process.env.NODEMAILER_PORT) : 0;

  @IsBoolean()
  NODEMAILER_SECURE = toBoolean(process.env.NODEMAILER_SECURE);

  @IsString()
  @IsNotEmpty()
  NODEMAILER_USER = process.env.NODEMAILER_USER || '';

  @IsString()
  @IsNotEmpty()
  NODEMAILER_PASS = process.env.NODEMAILER_PASS || '';
}
