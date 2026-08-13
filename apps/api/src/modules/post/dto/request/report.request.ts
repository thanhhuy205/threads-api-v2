import { ApiProperty } from '@nestjs/swagger';
import { ReportTargetType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReportDto {
  @ApiProperty({ maxLength: 1000 })
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsNotEmpty({ message: 'Report reason is required' })
  @MaxLength(1000, { message: 'Report reason must be at most 1000 characters' })
  reason!: string;

  @ApiProperty({ enum: ['post', 'user'] })
  @Transform(({ value }) => value === 'post' ? ReportTargetType.POST : value === 'user' ? ReportTargetType.USER : value)
  @IsEnum(ReportTargetType)
  type!: ReportTargetType;
}
