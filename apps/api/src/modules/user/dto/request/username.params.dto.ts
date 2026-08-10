import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UsernameParamsDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username!: string;
}

export class UsernameQueryDto {
  @ApiProperty({ example: 'john' })
  @IsString()
  @IsNotEmpty()
  q!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 100 })
  @IsOptional()
  @IsString()
  take?: string;
}

export class UserNameMentionQueryDto {
  @ApiProperty({ example: 'john' })
  @IsString()
  @IsNotEmpty()
  q!: string;
}
