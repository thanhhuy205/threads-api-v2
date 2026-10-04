import { ApiProperty } from '@nestjs/swagger';

export class OrgDomainResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  verified!: boolean;
}
