import { Injectable } from '@nestjs/common';
import type { DepartmentRoleRepository } from '../department-role.repository';

@Injectable()
export class DepartmentRoleRepositoryImpl implements DepartmentRoleRepository {}
