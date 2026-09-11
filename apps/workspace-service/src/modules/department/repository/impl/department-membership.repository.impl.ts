import { Injectable } from '@nestjs/common';
import type { DepartmentMembershipRepository } from '../department-membership.repository';

@Injectable()
export class DepartmentMembershipRepositoryImpl
  implements DepartmentMembershipRepository {}
