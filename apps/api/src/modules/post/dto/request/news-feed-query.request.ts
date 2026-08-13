import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { NewFeedType } from '../../enum';
import { CursorPaginationQueryDto } from './cursor-pagination-query.request';

export class NewsFeedQueryDto extends CursorPaginationQueryDto {
  @ApiPropertyOptional({ enum: NewFeedType })
  @IsOptional()
  @IsEnum(NewFeedType)
  type?: NewFeedType;
}
