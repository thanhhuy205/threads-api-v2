import { ApiProperty } from '@nestjs/swagger';

export class OrgResponseDto {
  @ApiProperty({ description: 'Organization primary identifier' })
  id!: string;

  @ApiProperty({ description: 'Referenced Keycloak realm identifier' })
  realmId!: string;

  @ApiProperty({ description: 'Referenced Keycloak group identifier' })
  groupId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  alias!: string;

  @ApiProperty()
  enabled!: boolean;

  @ApiProperty()
  description!: string;

  @ApiProperty({ format: 'uri' })
  redirectUrl!: string;
}
