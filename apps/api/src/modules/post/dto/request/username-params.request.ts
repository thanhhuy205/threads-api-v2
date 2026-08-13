import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsernameParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;
}
