import { Injectable } from '@nestjs/common';
import type { DepartmentRolePermissionRepository } from '../department-role-permission.repository';

@Injectable()
export class DepartmentRolePermissionRepositoryImpl
  implements DepartmentRolePermissionRepository {}
