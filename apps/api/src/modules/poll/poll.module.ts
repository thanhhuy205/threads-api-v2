import { Module } from '@nestjs/common';
import { TransactionModule } from '@/shared/transaction/transaction.module';
import { PollController } from './controller/poll.controller';
import { PollOptionsRepository } from './repository/poll-options.repository';
import { PollRepository } from './repository/poll.repository';
import { VoteRepository } from './repository/vote.repository';
import { PollOptionsService } from './service/poll-options.services';
import { PollService } from './service/poll.service';
import { VoteService } from './service/vote.service';

@Module({
  imports: [TransactionModule],
  controllers: [PollController],
  providers: [
    PollService,
    PollOptionsService,
    VoteService,
    PollRepository,
    PollOptionsRepository,
    VoteRepository,
  ],
})
export class PollModule {}
