import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PublicIdParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Post public ID is required' })
  publicId!: string;
}
