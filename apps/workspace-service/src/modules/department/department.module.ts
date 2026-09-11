import { Module } from '@nestjs/common';
import { DepartmentController } from './controller/department.controller';
import { DepartmentMembershipRepositoryImpl } from './repository/impl/department-membership.repository.impl';
import { DepartmentPermissionRepositoryImpl } from './repository/impl/department-permission.repository.impl';
import { DepartmentRolePermissionRepositoryImpl } from './repository/impl/department-role-permission.repository.impl';
import { DepartmentRoleRepositoryImpl } from './repository/impl/department-role.repository.impl';
import { DepartmentRepositoryImpl } from './repository/impl/department.repository.impl';
import { DEPARTMENT_MEMBERSHIP_REPOSITORY } from './repository/department-membership.repository';
import { DEPARTMENT_PERMISSION_REPOSITORY } from './repository/department-permission.repository';
import { DEPARTMENT_ROLE_PERMISSION_REPOSITORY } from './repository/department-role-permission.repository';
import { DEPARTMENT_ROLE_REPOSITORY } from './repository/department-role.repository';
import { DEPARTMENT_REPOSITORY } from './repository/department.repository';
import { DepartmentMembershipServiceImpl } from './service/impl/department-membership.service.impl';
import { DepartmentPermissionServiceImpl } from './service/impl/department-permission.service.impl';
import { DepartmentRolePermissionServiceImpl } from './service/impl/department-role-permission.service.impl';
import { DepartmentRoleServiceImpl } from './service/impl/department-role.service.impl';
import { DepartmentServiceImpl } from './service/impl/department.service.impl';
import { DEPARTMENT_MEMBERSHIP_SERVICE } from './service/department-membership.service';
import { DEPARTMENT_PERMISSION_SERVICE } from './service/department-permission.service';
import { DEPARTMENT_ROLE_PERMISSION_SERVICE } from './service/department-role-permission.service';
import { DEPARTMENT_ROLE_SERVICE } from './service/department-role.service';
import { DEPARTMENT_SERVICE } from './service/department.service';

@Module({
  controllers: [DepartmentController],
  providers: [
    { provide: DEPARTMENT_REPOSITORY, useClass: DepartmentRepositoryImpl },
    {
      provide: DEPARTMENT_MEMBERSHIP_REPOSITORY,
      useClass: DepartmentMembershipRepositoryImpl,
    },
    {
      provide: DEPARTMENT_ROLE_REPOSITORY,
      useClass: DepartmentRoleRepositoryImpl,
    },
    {
      provide: DEPARTMENT_ROLE_PERMISSION_REPOSITORY,
      useClass: DepartmentRolePermissionRepositoryImpl,
    },
    {
      provide: DEPARTMENT_PERMISSION_REPOSITORY,
      useClass: DepartmentPermissionRepositoryImpl,
    },
    { provide: DEPARTMENT_SERVICE, useClass: DepartmentServiceImpl },
    {
      provide: DEPARTMENT_MEMBERSHIP_SERVICE,
      useClass: DepartmentMembershipServiceImpl,
    },
    {
      provide: DEPARTMENT_ROLE_SERVICE,
      useClass: DepartmentRoleServiceImpl,
    },
    {
      provide: DEPARTMENT_ROLE_PERMISSION_SERVICE,
      useClass: DepartmentRolePermissionServiceImpl,
    },
    {
      provide: DEPARTMENT_PERMISSION_SERVICE,
      useClass: DepartmentPermissionServiceImpl,
    },
  ],
  exports: [
    DEPARTMENT_SERVICE,
    DEPARTMENT_MEMBERSHIP_SERVICE,
    DEPARTMENT_ROLE_SERVICE,
    DEPARTMENT_ROLE_PERMISSION_SERVICE,
    DEPARTMENT_PERMISSION_SERVICE,
  ],
})
export class DepartmentModule {}
