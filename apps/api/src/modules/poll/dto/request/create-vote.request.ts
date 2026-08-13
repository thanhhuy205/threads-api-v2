import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty({ minimum: 1, example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pollOptionId!: number;
}
