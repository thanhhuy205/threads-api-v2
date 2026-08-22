import { Module } from '@nestjs/common';
import { TopicController } from './controller/topic.controller';
import { TopicRepositoryImpl } from './repository/impl/topic.repository.impl';
import { TOPIC_REPOSITORY } from './repository/topic.repository';
import { TopicServiceImpl } from './service/impl/topic.service.impl';
import { TOPIC_SERVICE } from './service/topic.service';

@Module({
  controllers: [TopicController],
  providers: [
    { provide: TOPIC_REPOSITORY, useClass: TopicRepositoryImpl },
    { provide: TOPIC_SERVICE, useClass: TopicServiceImpl },
  ],
  exports: [TOPIC_SERVICE],
})
export class TopicModule {}
