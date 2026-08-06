import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class NotificationQueryDto {
  @ApiPropertyOptional({ description: 'Cursor returned by the previous response' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  after?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
