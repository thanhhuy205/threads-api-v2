import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CursorPaginationQueryDto {
  @ApiPropertyOptional({ description: 'Cursor from the previous response' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsNotEmpty({ message: 'Cursor must not be empty' })
  after?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Take must be an integer' })
  @Min(1, { message: 'Take must be a positive number' })
  @Max(100, { message: 'Take must be at most 100' })
  take?: number;
}
