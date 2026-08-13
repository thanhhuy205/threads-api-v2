import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@/modules/jwt/jwt.module';
import { ReportModule } from '@/modules/report/report.module';
import { UserModule } from '@/modules/user/user.module';
import { RedisVersionModule } from '@/shared/redis-version';
import { PostController } from './controller/post.controller';
import { PostInteractionRepository } from './repository/post-interaction.repository';
import { LikeRepository } from './repository/like.repository';
import { PostRepository } from './repository/post.repository';
import { TopicsPostRepository } from './repository/topics-post.repository';
import { PostActionService } from './service/post-action.service';
import { PostFeedService } from './service/post-feed.service';
import { PostMentionService } from './service/post-mention.service';
import { PostMetaService } from './service/post-meta.service';
import { PostSearchService } from './service/post-search.service';
import { PostUserService } from './service/post-user.service';
import { LikeService } from './service/like-service.service';
import { PostService } from './service/post.service';

@Module({
  imports: [forwardRef(() => UserModule), ReportModule, JwtModule, RedisVersionModule],
  controllers: [PostController],
  providers: [
    PostRepository,
    PostInteractionRepository,
    LikeRepository,
    TopicsPostRepository,
    PostService,
    PostActionService,
    PostFeedService,
    PostMentionService,
    PostMetaService,
    PostSearchService,
    PostUserService,
    LikeService,
  ],
  exports: [PostActionService, PostSearchService, LikeService, PostRepository],
})
export class PostModule {}
