import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SavePostDto {
  @ApiProperty()
  @IsBoolean({ message: 'isSaved must be a boolean value' })
  isSaved!: boolean;
}
