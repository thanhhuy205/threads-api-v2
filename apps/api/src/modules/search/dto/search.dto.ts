import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class SearchPostsQueryDto {
  @ApiProperty({ minLength: 1, example: 'prisma' })
  @IsString()
  @MinLength(1)
  q!: string;

  @ApiPropertyOptional({ description: 'Cursor returned by the previous response' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  after?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;

  @ApiPropertyOptional({ enum: ['default'], default: 'default' })
  @IsOptional()
  @IsIn(['default'])
  serp_type?: 'default';
}

export class SearchUsernameQueryDto {
  @ApiProperty({ minLength: 1, example: 'john' })
  @IsString()
  @MinLength(1)
  q!: string;
}

export class SearchTopicQueryDto {
  @ApiProperty({ minLength: 1, example: 'nestjs' })
  @IsString()
  @MinLength(1)
  q!: string;
}
