import { Injectable } from '@nestjs/common';
import type { DepartmentRepository } from '../department.repository';

@Injectable()
export class DepartmentRepositoryImpl implements DepartmentRepository {}
