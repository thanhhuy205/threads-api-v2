import { TransactionModule } from '@/shared/transaction/transaction.module';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AbilityModule } from '../ability/ability.module';
import { GroupTeamController } from './controller/group-team.controller';
import { GroupTeamRepository } from './repository/group-team.repository';
import { UserTeamRepository } from './repository/user-team.repository';
import { GroupTeamService } from './service/group-team.service';
import { UserTeamService } from './service/user-team.service';

@Module({
  imports: [TransactionModule, UserModule, AbilityModule],
  controllers: [GroupTeamController],
  providers: [
    GroupTeamService,
    UserTeamService,
    GroupTeamRepository,
    UserTeamRepository,
  ],
  exports: [GroupTeamService, UserTeamService],
})
export class GroupTeamModule {}
