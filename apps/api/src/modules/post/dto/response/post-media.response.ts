import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class PostMediaDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsString()
  key!: string;

  @ApiProperty()
  @IsString()
  url!: string;
}
