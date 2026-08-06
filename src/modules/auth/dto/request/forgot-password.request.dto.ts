import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';
import { AuthErrorMessage } from './auth-error-message';

export class ForgotPasswordDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail({}, { message: AuthErrorMessage.EMAIL_INVALID })
  @MaxLength(255)
  email!: string;
}
