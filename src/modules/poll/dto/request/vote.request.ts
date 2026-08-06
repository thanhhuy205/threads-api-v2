import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class VoteParamsDto {
  @ApiProperty({ minimum: 1, example: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pollId!: number;
}

export class CreateVoteDto {
  @ApiProperty({ minimum: 1, example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pollOptionId!: number;
}
