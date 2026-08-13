import { ApiPropertyOptional } from '@nestjs/swagger';
import { VisibilityPost } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const normalizeEnum = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class UpdatePostDto {
  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Content must be at least 1 character' })
  @MaxLength(5000, { message: 'Content must be at most 5000 characters' })
  content?: string;

  @ApiPropertyOptional({ enum: VisibilityPost })
  @IsOptional()
  @Transform(normalizeEnum)
  @IsEnum(VisibilityPost)
  visibility?: VisibilityPost;
}
