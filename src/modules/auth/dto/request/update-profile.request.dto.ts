import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;

export class UpdateProfileDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500, { message: 'Bio must be at most 500 characters' })
  bio?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255, { message: 'Location must be at most 255 characters' })
  location?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(255, { message: 'Website must be at most 255 characters' })
  website?: string;

  @IsOptional()
  avatar?: unknown;
}
