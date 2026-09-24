import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { CursorPaginationQueryDto } from './cursor-pagination-query.request.dto';

export const newsFeedTypes = ['for_you'] as const;

export class NewsFeedQueryDto extends CursorPaginationQueryDto {
    @ApiPropertyOptional({ enum: newsFeedTypes, default: 'for_you' })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    @IsEnum(newsFeedTypes)
    type?: (typeof newsFeedTypes)[number] = 'for_you';
}
