import { Injectable } from '@nestjs/common';
import type { DepartmentMembershipService } from '../department-membership.service';

@Injectable()
export class DepartmentMembershipServiceImpl
  implements DepartmentMembershipService {}
