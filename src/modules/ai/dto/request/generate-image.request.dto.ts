import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateImageRequestDto {
  @ApiProperty({ example: 'A dreamy sunset over a calm lake, cinematic lighting' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
