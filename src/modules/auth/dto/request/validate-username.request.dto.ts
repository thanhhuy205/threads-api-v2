import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthErrorMessage } from './auth-error-message';

const usernameRegex = /^[a-zA-Z0-9._-]{3,32}$/;

export class ValidateUsernameDto {
  @ApiProperty({ example: 'threads_user', minLength: 3, maxLength: 32 })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(3, { message: AuthErrorMessage.USERNAME_INVALID })
  @MaxLength(32, { message: AuthErrorMessage.USERNAME_INVALID })
  @Matches(usernameRegex, { message: AuthErrorMessage.USERNAME_RULE })
  username!: string;
}
