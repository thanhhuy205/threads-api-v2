import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum BillingPlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  MAX = 'MAX',
}

export class CreateBillingDto {
  @ApiProperty({ enum: BillingPlanType, example: BillingPlanType.FREE })
  @IsEnum(BillingPlanType)
  type!: BillingPlanType;

  @ApiProperty({ example: '0.00', description: 'Monthly price' })
  @IsString()
  price!: string;

  @ApiPropertyOptional({ example: 'Basic plan for small teams' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  detail?: string;
}
