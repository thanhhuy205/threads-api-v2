import { ApiProperty } from '@nestjs/swagger';

export class OrgInvitationResponseDto {
  @ApiProperty({ description: 'Invitation primary identifier' })
  id!: string;

  @ApiProperty({ description: 'Referenced organization identifier' })
  organizationId!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ type: Number, format: 'int64' })
  createdAt!: number;

  @ApiProperty({ type: Number, format: 'int64' })
  expiresAt!: number;

  @ApiProperty({ format: 'uri' })
  inviteLink!: string;
}
