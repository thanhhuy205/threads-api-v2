import { Matches, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class AdminStatsQueryDto {
  @ApiPropertyOptional({ example: '2026-01-01', format: 'date' })
  @IsOptional()
  @Matches(DATE_PATTERN, { message: 'Date must use YYYY-MM-DD format' })
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-01-31', format: 'date' })
  @IsOptional()
  @Matches(DATE_PATTERN, { message: 'Date must use YYYY-MM-DD format' })
  endDate?: string;
}
