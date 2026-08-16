import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsMilitaryTime, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Content must be at least 1 character' })
  @MaxLength(5000, { message: 'Content must be at most 5000 characters' })
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateRangeFrom?: Date | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateRangeTo?: Date | null;

  @ApiPropertyOptional({ type: String, example: '09:00', nullable: true })
  @IsOptional()
  @IsMilitaryTime()
  scheduledTimeFrom?: string | null;

  @ApiPropertyOptional({ type: String, example: '17:30', nullable: true })
  @IsOptional()
  @IsMilitaryTime()
  scheduledTimeTo?: string | null;

}
