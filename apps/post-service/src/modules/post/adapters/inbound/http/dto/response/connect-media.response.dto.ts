import { ApiProperty } from '@nestjs/swagger';

export class ConnectMediaResponseDto {
  @ApiProperty({ example: 2 })
  count!: number;
}
