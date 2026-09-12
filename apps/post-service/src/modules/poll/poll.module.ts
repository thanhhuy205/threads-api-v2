import { Module } from '@nestjs/common';
import { TransactionModule } from '@post-service/transaction/transaction.module';
import { PollController } from './controller/poll.controller';
import { PollOptionsRepositoryImpl } from './repository/impl/poll-options.repository.impl';
import { PollRepositoryImpl } from './repository/impl/poll.repository.impl';
import { VoteRepositoryImpl } from './repository/impl/vote.repository.impl';
import { POLL_OPTIONS_REPOSITORY } from './repository/poll-options.repository';
import { POLL_REPOSITORY } from './repository/poll.repository';
import { VOTE_REPOSITORY } from './repository/vote.repository';
import { PollOptionsServiceImpl } from './service/impl/poll-options.services.impl';
import { PollServiceImpl } from './service/impl/poll.service.impl';
import { VoteServiceImpl } from './service/impl/vote.service.impl';
import { POLL_OPTIONS_SERVICE } from './service/poll-options.services';
import { POLL_SERVICE } from './service/poll.service';
import { VOTE_SERVICE } from './service/vote.service';

@Module({
  imports: [TransactionModule],
  controllers: [PollController],
  providers: [
    { provide: POLL_REPOSITORY, useClass: PollRepositoryImpl },
    { provide: POLL_OPTIONS_REPOSITORY, useClass: PollOptionsRepositoryImpl },
    { provide: VOTE_REPOSITORY, useClass: VoteRepositoryImpl },
    { provide: POLL_SERVICE, useClass: PollServiceImpl },
    { provide: POLL_OPTIONS_SERVICE, useClass: PollOptionsServiceImpl },
    { provide: VOTE_SERVICE, useClass: VoteServiceImpl },
  ],
})
export class PollModule { }
