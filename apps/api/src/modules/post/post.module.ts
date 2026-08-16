import { AccessControlModule } from '@/modules/access-control/access-control.module';
import { GroupTeamModule } from '@/modules/group-team/group-team.module';
import { JwtModule } from '@/modules/jwt/jwt.module';
import { UserModule } from '@/modules/user/user.module';
import { RedisVersionModule } from '@/shared/redis-version';
import { TransactionModule } from '@/shared/transaction/transaction.module';
import { AnnouncementPolicy } from '@api/modules/post/policies/announcement.policy';
import { ExpirationPolicy } from '@api/modules/post/policies/expiration.policy';
import { POST_CREATION_POLICIES } from '@api/modules/post/policies/interface/post-creation-policy.interface';
import { PinPolicy } from '@api/modules/post/policies/pin.policy';
import { forwardRef, Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { LikeRepository } from './repository/like.repository';
import { PostInteractionRepository } from './repository/post-interaction.repository';
import { PostRepository } from './repository/post.repository';
import { TopicsPostRepository } from './repository/topics-post.repository';
import { LikeService } from './service/like-service.service';
import { PostActionService } from './service/post-action.service';
import { PostFeedService } from './service/post-feed.service';
import { PostMentionService } from './service/post-mention.service';
import { PostMetaService } from './service/post-meta.service';
import { PostSearchService } from './service/post-search.service';
import { PostUserService } from './service/post-user.service';
import { PostService } from './service/post.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule,
    RedisVersionModule,
    TransactionModule,
    AccessControlModule,
    GroupTeamModule,

  ],
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
    AnnouncementPolicy,
    PinPolicy,
    ExpirationPolicy,
    {
      provide: POST_CREATION_POLICIES,

      useFactory: (
        announcement: AnnouncementPolicy,
        pin: PinPolicy,
        expiration: ExpirationPolicy,
      ) => [announcement, pin, expiration],

      inject: [AnnouncementPolicy, PinPolicy, ExpirationPolicy],
    },
  ],
  exports: [PostActionService, PostSearchService, LikeService],
})
export class PostModule { }
