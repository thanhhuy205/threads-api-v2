import { ApiProperty } from '@nestjs/swagger';

export class OrgDomainResponseDto {
  @ApiProperty({ description: 'Organization domain primary identifier' })
  id!: string;

  @ApiProperty({ description: 'Referenced organization identifier' })
  orgId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  verified!: boolean;
}
