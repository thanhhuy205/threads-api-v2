import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessage } from './auth-error-message';
import { MatchesPassword } from './validation.decorators';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token' })
  @IsString()
  @MinLength(1, { message: 'Reset token is required' })
  token!: string;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail({}, { message: AuthErrorMessage.EMAIL_INVALID })
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'new-secure-password', format: 'password', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8, { message: AuthErrorMessage.PASSWORD_MIN })
  @MaxLength(128)
  password!: string;

  @ApiProperty({ example: 'new-secure-password', format: 'password' })
  @IsString()
  @MatchesPassword()
  confirmPassword!: string;
}
