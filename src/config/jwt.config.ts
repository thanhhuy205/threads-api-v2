import { IsNotEmpty, IsString } from 'class-validator';

export class JwtConfiguration {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET = process.env.JWT_SECRET || '';

  @IsString()
  @IsNotEmpty()
  ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';

  @IsString()
  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

  @IsString()
  @IsNotEmpty()
  RESET_PASSWORD_TOKEN_EXPIRES_IN_TEXT = process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN_TEXT || '15m';

  @IsString()
  @IsNotEmpty()
  RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN_TEXT = process.env.RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN_TEXT || '15m';

  @IsString()
  @IsNotEmpty()
  RESET_PASSWORD_TOKEN_EXPIRES_IN = process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN || '15';

  @IsString()
  @IsNotEmpty()
  RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN = process.env.RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN || '15';
}
