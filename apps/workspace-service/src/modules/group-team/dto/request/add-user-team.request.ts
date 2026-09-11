import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Position } from 'apps/workspace-service/generated/prisma';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class AddUserTeamDto {
  @ApiProperty({ description: 'ID of the user to add to the team' })
  @IsString()
  @MinLength(1)
  userId!: string;

  @ApiPropertyOptional({ enum: Position, default: Position.OTHER })
  @IsOptional()
  @IsEnum(Position)
  position?: Position;
}
