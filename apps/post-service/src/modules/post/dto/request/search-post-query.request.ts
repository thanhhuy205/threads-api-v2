import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchPostQueryDto {
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Comma-separated topic names' })
  @IsOptional()
  @IsString()
  topics?: string;

  @ApiPropertyOptional({ default: '10' })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional({ default: '1' })
  @IsOptional()
  @IsString()
  page?: string;
}
