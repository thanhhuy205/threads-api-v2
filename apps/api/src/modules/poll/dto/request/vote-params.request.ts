import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class VoteParamsDto {
  @ApiProperty({ minimum: 1, example: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pollId!: number;
}
