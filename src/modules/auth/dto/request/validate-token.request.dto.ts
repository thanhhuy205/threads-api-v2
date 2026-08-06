import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenDto {
  @ApiProperty({ example: 'verification-or-reset-token' })
  @IsString()
  @MinLength(1, { message: 'Token is required' })
  token!: string;
}
