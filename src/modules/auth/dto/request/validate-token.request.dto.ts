import { IsString, MinLength } from 'class-validator';

export class ValidateTokenDto {
  @IsString()
  @MinLength(1, { message: 'Token is required' })
  token!: string;
}
