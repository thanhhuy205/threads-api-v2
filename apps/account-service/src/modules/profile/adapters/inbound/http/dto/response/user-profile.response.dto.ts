import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileResponseDto {
  @ApiPropertyOptional({ type: String, nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  bio!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  labelWebsite!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'uri' })
  website!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  companyName!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  companySize!: string | null;
}

export class OnboardingResponseDto {
  @ApiProperty({ type: String, nullable: true })
  name!: string | null;

  @ApiProperty({ type: String, nullable: true })
  bio!: string | null;

  @ApiProperty({ type: String, nullable: true })
  location!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'uri' })
  avatar!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  companyName!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  companySize!: string | null;
}

export class CurrentUserProfileResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  identity!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  bio!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'uri' })
  avatar!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  location!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'uri' })
  website!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  labelWebsite!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  companyName!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  companySize!: string | null;

  @ApiProperty({ type: Date, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: Date, format: 'date-time' })
  updatedAt!: Date;
}
