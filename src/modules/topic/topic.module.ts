import { Module } from '@nestjs/common';
import { TopicController } from './controller/topic.controller';
import { TopicRepository } from './repository/topic.repository';
import { TopicService } from './service/topic.service';

@Module({
  controllers: [TopicController],
  providers: [TopicService, TopicRepository],
  exports: [TopicService],
})
export class TopicModule {}
