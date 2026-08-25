import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({ default: 'IMAGE' })
  @IsOptional()
  @IsString()
  type: string = 'IMAGE';

  @ApiProperty({ default: 'UPLOADED' })
  @IsOptional()
  @IsString()
  status: string = 'UPLOADED';

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  width: number = 0;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  height: number = 0;
}
