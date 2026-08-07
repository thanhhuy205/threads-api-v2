import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportTargetType } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { NewFeedType } from '../../enum';

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

export class NewsFeedQueryDto extends CursorPaginationQueryDto {
  @ApiPropertyOptional({ enum: NewFeedType })
  @IsOptional()
  @IsEnum(NewFeedType)
  type?: NewFeedType;
}

export class PublicIdParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Post public ID is required' })
  publicId!: string;
}

export class UsernameParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;
}

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

export class SavePostDto {
  @ApiProperty()
  @IsBoolean({ message: 'isSaved must be a boolean value' })
  isSaved!: boolean;
}

export class HidePostDto {
  @ApiProperty()
  @IsBoolean({ message: 'isHidden must be a boolean value' })
  isHidden!: boolean;
}

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
