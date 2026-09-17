import { DEFAULT_PAGE, MAX_LIMIT, PER_PAGE } from '../constants/pagination';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: DEFAULT_PAGE, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: PER_PAGE, minimum: 1, maximum: MAX_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number;
}

export class CursorPaginationQueryDto {
  @ApiPropertyOptional({ description: 'Cursor from the previous response' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Cursor must not be empty' })
  after?: string;

  @ApiPropertyOptional({ default: PER_PAGE, minimum: 1, maximum: MAX_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Take must be a number' })
  @Min(1, { message: 'Take must be a positive number' })
  @Max(MAX_LIMIT, { message: `Take must be at most ${MAX_LIMIT}` })
  take?: number;
}

export class OffsetPaginationMetaDto {
  @ApiProperty({ example: 1 })
  currentPage!: number;

  @ApiProperty({ example: 10 })
  perPage!: number;

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 5 })
  lastPage!: number;

  @ApiProperty({ example: 1 })
  from!: number;

  @ApiProperty({ example: 10 })
  to!: number;
}

export class CursorPaginationMetaDto {
  @ApiProperty({ example: 10 })
  take!: number;

  @ApiProperty({ nullable: true, example: 'post_01J...' })
  after!: string | null;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}

export type OffsetPagination = {
  page: number;
  limit: number;
  offset: number;
};

export type CursorPagination = {
  after: string | null;
  take: number;
};

export type CursorPaginationMeta = {
  after: string | null;
  take: number;
  hasMore: boolean;
};
