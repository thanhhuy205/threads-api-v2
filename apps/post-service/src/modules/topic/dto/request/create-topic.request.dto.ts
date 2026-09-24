import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ minLength: 1, maxLength: 255, example: 'NestJS' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;
}
