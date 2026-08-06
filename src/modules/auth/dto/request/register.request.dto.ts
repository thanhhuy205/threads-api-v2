import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { AuthErrorMessage } from './auth-error-message';
import { MatchesPassword } from './validation.decorators';

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

export class RegisterDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(usernameRegex, { message: AuthErrorMessage.USERNAME_RULE })
  username!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail({}, { message: AuthErrorMessage.EMAIL_INVALID })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  password!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  @MatchesPassword()
  confirmPassword!: string;
}
