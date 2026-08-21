import { Module } from '@nestjs/common';
import { AbilityRepositoryImpl } from './repository/impl/ability.repository.impl';
import { ABILITY_REPOSITORY } from './repository/ability.repository';
import { AbilityServiceImpl } from './service/impl/ability.service.impl';
import { ABILITY_SERVICE } from './service/ability.service';
import { RoleRepositoryImpl } from './repository/impl/role.repository.impl';
import { UserRoleRepositoryImpl } from './repository/impl/user-role.repository.impl';
import { ROLE_REPOSITORY } from './repository/role.repository';
import { USER_ROLE_REPOSITORY } from './repository/user-role.repository';
import { RoleServiceImpl } from './service/impl/role.service.impl';
import { UserRoleServiceImpl } from './service/impl/user-role.service.impl';
import { ROLE_SERVICE } from './service/role.service';
import { USER_ROLE_SERVICE } from './service/user-role.service';

@Module({
  providers: [
    { provide: ABILITY_REPOSITORY, useClass: AbilityRepositoryImpl },
    { provide: ABILITY_SERVICE, useClass: AbilityServiceImpl },
    { provide: ROLE_REPOSITORY, useClass: RoleRepositoryImpl },
    { provide: USER_ROLE_REPOSITORY, useClass: UserRoleRepositoryImpl },
    { provide: ROLE_SERVICE, useClass: RoleServiceImpl },
    { provide: USER_ROLE_SERVICE, useClass: UserRoleServiceImpl },
  ],
  exports: [ABILITY_SERVICE, ROLE_SERVICE, USER_ROLE_SERVICE],
})
export class AbilityModule {}
