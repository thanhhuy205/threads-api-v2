import { Module } from '@nestjs/common';
import { TopicModule } from '../topic/topic.module';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { SearchController } from './controller/search.controller';
import { SearchService } from './service/search.service';

@Module({
  imports: [TopicModule, UserModule, PostModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
