import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Ada Lovelace', maxLength: 100 })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name?: string;

  @ApiPropertyOptional({ example: 'Building the next thing.', maxLength: 500 })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500, { message: 'Bio must be at most 500 characters' })
  bio?: string;

  @ApiPropertyOptional({ example: 'Bangkok, Thailand', maxLength: 255 })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255, { message: 'Location must be at most 255 characters' })
  location?: string;

  @ApiPropertyOptional({ example: 'https://example.com', maxLength: 255 })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255, { message: 'Website must be at most 255 characters' })
  website?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  avatar?: unknown;
}
