import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export class FriendRequestParamsDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username!: string;
}
