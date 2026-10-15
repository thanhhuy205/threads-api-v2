import { ApiProperty } from '@nestjs/swagger';
import { OrgDomainResponseDto } from './org-domain.response.dto';

export class OrgResponseDto {
  @ApiProperty({ description: 'Organization primary identifier' })
  id!: string;

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

  @ApiProperty({ type: () => OrgDomainResponseDto, isArray: true })
  domains!: OrgDomainResponseDto[];
}
