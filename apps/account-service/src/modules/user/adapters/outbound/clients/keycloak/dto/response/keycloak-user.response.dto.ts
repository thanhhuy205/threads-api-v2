import { ApiProperty } from '@nestjs/swagger';

export class KeycloakUserResponseDto {
  @ApiProperty({ example: 'example-user-id' })
  id!: string;

  @ApiProperty({ example: 'huy' })
  username!: string;

  @ApiProperty({ example: 'Huy' })
  firstName!: string;

  @ApiProperty({ example: 'huy@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: true })
  enabled!: boolean;

  @ApiProperty({ example: false })
  emailVerified!: boolean;
}
