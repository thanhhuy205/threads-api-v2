import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Actions that an external admin request may ask for.
 * The service maps each action to the report and target updates.
 */
export const reportModerationActions = [
  "approve",
  "delete_post",
] as const;

/**
 * External request body for PATCH /admin/reports/:reportId.
 */
export type ReportModerationAction = (typeof reportModerationActions)[number];

export class ModerateReportRequestDto {
  @ApiProperty({ enum: reportModerationActions })
  @IsEnum(reportModerationActions)
  action!: ReportModerationAction;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNote?: string;
}
