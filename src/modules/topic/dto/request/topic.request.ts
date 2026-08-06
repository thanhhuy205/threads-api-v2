import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ minLength: 1, maxLength: 255, example: 'NestJS' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;
}

export class SearchTopicQueryDto {
  @ApiProperty({ minLength: 1, example: 'nestjs' })
  @IsString()
  @MinLength(1)
  q!: string;

  @ApiPropertyOptional({ description: 'Accepted for backward compatibility' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  after?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
