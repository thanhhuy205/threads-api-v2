import { Module } from '@nestjs/common';
import { AbilityRepositoryImpl } from './repository/impl/ability.repository.impl';
import { ABILITY_REPOSITORY } from './repository/ability.repository';
import { AbilityServiceImpl } from './service/impl/ability.service.impl';
import { ABILITY_SERVICE } from './ability.service';

@Module({
  providers: [
    { provide: ABILITY_REPOSITORY, useClass: AbilityRepositoryImpl },
    { provide: ABILITY_SERVICE, useClass: AbilityServiceImpl },
  ],
  exports: [ABILITY_SERVICE],
})
export class AbilityModule {}
