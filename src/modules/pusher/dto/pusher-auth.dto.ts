import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PusherAuthDto {
  @ApiProperty({ example: '1234.5678' })
  @IsString()
  @IsNotEmpty()
  socket_id!: string;

  @ApiProperty({ example: 'private-user-user_123' })
  @IsString()
  @IsNotEmpty()
  channel_name!: string;
}
