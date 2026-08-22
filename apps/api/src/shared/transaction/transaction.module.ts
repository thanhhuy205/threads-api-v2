import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/shared/database';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
