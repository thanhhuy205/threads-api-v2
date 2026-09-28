import type { CreateOrganizationCommand } from '../../commands';
import type { Organization } from '../../../domain';
import type { CreatedOrganization } from '../../result';

export const ORGANIZATION_USE_CASE = Symbol('ORGANIZATION_USE_CASE');

export interface OrganizationUseCase {
  findAll(): Promise<Organization[]>;
  create(command: CreateOrganizationCommand): Promise<CreatedOrganization>;
}
