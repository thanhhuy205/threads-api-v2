import { Module } from '@nestjs/common';
import { PermissionRepository } from './permission/repository/permission.repository';
import { RolePermissionRepository } from './permission/repository/role-permission.repository';
import { PermissionService } from './permission/service/permission.service';
import { RolePermissionService } from './permission/service/role-permission.service';
import { UserPositionRepository } from './position/repository/user-position.repository';
import { RoleRepository } from './role/repository/role.repository';
import { UserRoleRepository } from './role/repository/user-role.repository';
import { RoleService } from './role/service/role.service';
import { UserRoleService } from './role/service/user-role.service';
import { AccessControlService } from './services/access-control.service';

@Module({
  providers: [
    PermissionRepository,
    RolePermissionRepository,
    RoleRepository,
    UserRoleRepository,
    UserPositionRepository,
    PermissionService,
    RolePermissionService,
    RoleService,
    UserRoleService,
    AccessControlService,
  ],
  exports: [
    PermissionService,
    RolePermissionService,
    RoleService,
    UserRoleService,
    AccessControlService,
  ],
})
export class AccessControlModule { }
