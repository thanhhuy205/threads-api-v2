import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostMentionDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsNotEmpty({ message: 'Mention userId is required' })
  userId!: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsNotEmpty({ message: 'Mention username is required' })
  username!: string;
}
