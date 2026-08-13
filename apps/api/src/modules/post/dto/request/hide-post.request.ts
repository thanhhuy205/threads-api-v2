import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class HidePostDto {
  @ApiProperty()
  @IsBoolean({ message: 'isHidden must be a boolean value' })
  isHidden!: boolean;
}
