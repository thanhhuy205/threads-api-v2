import { Module } from '@nestjs/common';
import { RedisVersionService } from './redis-version.service';

@Module({
  providers: [RedisVersionService],
  exports: [RedisVersionService],
})
export class RedisVersionModule {}
