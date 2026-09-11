import { Injectable } from '@nestjs/common';
import type { DepartmentPermissionRepository } from '../department-permission.repository';

@Injectable()
export class DepartmentPermissionRepositoryImpl
  implements DepartmentPermissionRepository {}
