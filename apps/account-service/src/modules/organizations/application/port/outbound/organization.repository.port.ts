import type { Organization } from '../../../domain';
import type { CreateOrganizationCommand } from '../../commands';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface OrganizationRepository {
  findAll(): Promise<Organization[]>;
  create(command: CreateOrganizationCommand): Promise<Organization>;
}
