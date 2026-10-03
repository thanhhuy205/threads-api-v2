import { ApiProperty } from '@nestjs/swagger';

export class TeamResponseDto {
  @ApiProperty({ example: 'example-group-id' })
  id!: string;

  @ApiProperty({ example: 'Backend Team' })
  name!: string;
}
