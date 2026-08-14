import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GroupTeamParamsDto {
  @ApiProperty({ description: 'Public ID of the team' })
  @IsString()
  @MinLength(1)
  teamPublicId!: string;
}
