import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class OnboardingDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  bio!: string;

  @ApiProperty({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  location!: string;

  @ApiPropertyOptional({ maxLength: 255, format: 'uri' })
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(255)
  avatar?: string;
}
