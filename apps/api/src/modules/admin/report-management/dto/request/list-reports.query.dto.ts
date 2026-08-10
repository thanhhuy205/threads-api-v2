import { ReportStatus } from "@prisma/client";
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MAX_LIMIT } from '@/constants/pagination';

export const reportListTypes = ["post", "user"] as const;

export type ReportListType = (typeof reportListTypes)[number];

export class ListReportsQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: MAX_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number;

  @ApiPropertyOptional({ enum: reportListTypes, default: 'post' })
  @IsOptional()
  @IsEnum(reportListTypes)
  type?: ReportListType;

  @ApiPropertyOptional({ enum: ['pending', 'resolved', 'dismissed'] })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}
