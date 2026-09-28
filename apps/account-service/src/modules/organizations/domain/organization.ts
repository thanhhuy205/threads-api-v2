export type Organization = {
  id: string;
  name: string;
  billingId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type KeycloakOrganization = {
  id: string;
  name: string;
};
