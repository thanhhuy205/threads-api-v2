import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileResponseDto {
  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ nullable: true })
  bio!: string | null;

  @ApiPropertyOptional({ nullable: true })
  labelWebsite!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'uri' })
  website!: string | null;
}

export class OnboardingResponseDto {
  @ApiProperty({ nullable: true })
  name!: string | null;

  @ApiProperty({ nullable: true })
  bio!: string | null;

  @ApiProperty({ nullable: true })
  location!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'uri' })
  avatar!: string | null;
}

export class CurrentUserProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identity!: string;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ nullable: true })
  bio!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'uri' })
  avatar!: string | null;

  @ApiPropertyOptional({ nullable: true })
  location!: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'uri' })
  website!: string | null;

  @ApiPropertyOptional({ nullable: true })
  labelWebsite!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: Date;
}
