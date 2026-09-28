import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrganizationRequestDto {
  @ApiProperty({ maxLength: 100, example: 'Acme Inc.' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ description: 'Billing plan identifier' })
  @IsOptional()
  @IsString()
  billingId?: string;
}
