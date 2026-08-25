import { Module } from '@nestjs/common';
import { TopicModule } from '@post-service/modules/topic/topic.module';
import { UserModule } from '@user-service/modules/user/user.module';
import { PostModule } from '@post-service/modules/post/post.module';
import { SearchController } from './controller/search.controller';
import { SearchServiceImpl } from './service/impl/search.service.impl';
import { SEARCH_SERVICE } from './service/search.service';

@Module({
  imports: [TopicModule, UserModule, PostModule],
  controllers: [SearchController],
  providers: [{ provide: SEARCH_SERVICE, useClass: SearchServiceImpl }],
})
export class SearchModule { }
