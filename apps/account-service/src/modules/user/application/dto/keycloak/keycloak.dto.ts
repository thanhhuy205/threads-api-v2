export class OrgDomainDto {
  name!: string;
  verified!: boolean;
}

export class OrgDto {
  id!: string;
  name!: string;
  alias!: string;
  enabled!: boolean;
  description!: string;
  redirectUrl!: string;
  domains!: OrgDomainDto[];
}

export class TeamDto {
  id!: string;
  name!: string;
}

export class KeycloakUserDto {
  id!: string;
  username!: string;
  firstName!: string;
  email!: string;
  enabled!: boolean;
  emailVerified!: boolean;
}

export class GetTokenDto {
  access_token!: string;
  expires_in!: number;
  token_type!: string;
  refresh_token?: string;
  id_token?: string;
}
