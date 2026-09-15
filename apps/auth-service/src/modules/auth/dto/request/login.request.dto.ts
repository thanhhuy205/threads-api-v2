import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsEmailOrUsername } from './validation.decorators';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address or username' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(3, { message: 'Login must be at least 3 characters' })
  @MaxLength(255, { message: 'Login must be at most 255 characters' })
  @IsEmailOrUsername()
  login!: string;

  @ApiProperty({ example: 'secure-password', format: 'password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  password!: string;
}
