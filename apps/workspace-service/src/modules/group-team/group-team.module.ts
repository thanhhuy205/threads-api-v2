import { TransactionModule } from '@workspace-service/transaction/transaction.module';
import { Module } from '@nestjs/common';
import { AbilityModule } from '@workspace-service/modules/ability/ability.module';
import { GroupTeamController } from './controller/group-team.controller';
import { GroupTeamRepositoryImpl } from './repository/impl/group-team.repository.impl';
import { UserTeamRepositoryImpl } from './repository/impl/user-team.repository.impl';
import { GROUP_TEAM_REPOSITORY } from './repository/group-team.repository';
import { USER_TEAM_REPOSITORY } from './repository/user-team.repository';
import { GroupTeamServiceImpl } from './service/impl/group-team.service.impl';
import { UserTeamServiceImpl } from './service/impl/user-team.service.impl';
import { GROUP_TEAM_SERVICE } from './service/group-team.service';
import { USER_TEAM_SERVICE } from './service/user-team.service';

@Module({
  imports: [TransactionModule, AbilityModule],
  controllers: [GroupTeamController],
  providers: [
    { provide: GROUP_TEAM_REPOSITORY, useClass: GroupTeamRepositoryImpl },
    { provide: USER_TEAM_REPOSITORY, useClass: UserTeamRepositoryImpl },
    { provide: GROUP_TEAM_SERVICE, useClass: GroupTeamServiceImpl },
    { provide: USER_TEAM_SERVICE, useClass: UserTeamServiceImpl },
  ],
  exports: [GROUP_TEAM_SERVICE, USER_TEAM_SERVICE],
})
export class GroupTeamModule {}
