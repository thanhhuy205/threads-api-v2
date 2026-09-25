import { ApiProperty } from '@nestjs/swagger';

export class StatusProfileResponseDto {
  @ApiProperty()
  isSuccessBio!: boolean;

  @ApiProperty()
  isSuccessAvatar!: boolean;
}

