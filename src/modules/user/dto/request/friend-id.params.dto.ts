import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class FriendRequestDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isAccept!: boolean;
}
