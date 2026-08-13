import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserNameMentionQueryDto {
  @ApiProperty({ example: 'john' })
  @IsString()
  @IsNotEmpty()
  q!: string;
}
