import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;
}
