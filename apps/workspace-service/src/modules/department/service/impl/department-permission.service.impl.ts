import { Injectable } from '@nestjs/common';
import type { DepartmentPermissionService } from '../department-permission.service';

@Injectable()
export class DepartmentPermissionServiceImpl
  implements DepartmentPermissionService {}
