import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthErrorMessage } from './auth-error-message';
import { MatchesPassword } from './validation.decorators';

export class ResetPasswordDto {
  @IsString()
  @MinLength(1, { message: 'Reset token is required' })
  token!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail({}, { message: AuthErrorMessage.EMAIL_INVALID })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8, { message: AuthErrorMessage.PASSWORD_MIN })
  @MaxLength(128)
  password!: string;

  @IsString()
  @MatchesPassword()
  confirmPassword!: string;
}
