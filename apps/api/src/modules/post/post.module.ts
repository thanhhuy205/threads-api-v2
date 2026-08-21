import { AccessControlModule } from '@/modules/access-control/access-control.module';
import { GroupTeamModule } from '@/modules/group-team/group-team.module';
import { JwtModule } from '@/modules/jwt/jwt.module';
import { RedisVersionModule } from '@/shared/redis-version';
import { TransactionModule } from '@/shared/transaction/transaction.module';
import { AiModule } from '@api/modules/ai/ai.module';
import { UserModule } from '@api/modules/user/user.module';
import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { AnnouncementPolicy } from './policies/announcement.policy';
import { ExpirationPolicy } from './policies/expiration.policy';
import { POST_CREATION_POLICIES } from './policies/interface/post-creation-policy.interface';
import { PinPolicy } from './policies/pin.policy';
import { LikeRepositoryImpl } from './repository/impl/like.repository.impl';
import { PostInteractionRepositoryImpl } from './repository/impl/post-interaction.repository.impl';
import { PostRepositoryImpl } from './repository/impl/post.repository.impl';
import { TopicsPostRepositoryImpl } from './repository/impl/topics-post.repository.impl';
import { LIKE_REPOSITORY } from './repository/like.repository';
import { POST_INTERACTION_REPOSITORY } from './repository/post-interaction.repository';
import { POST_REPOSITORY } from './repository/post.repository';
import { TOPICS_POST_REPOSITORY } from './repository/topics-post.repository';
import { LikeServiceImpl } from './service/impl/like.service.impl';
import { OverviewDeclineServiceImpl } from './service/impl/overview-decline.service.impl';
import { PostActionServiceImpl } from './service/impl/post-action.service.impl';
import { PostFeedServiceImpl } from './service/impl/post-feed.service.impl';
import { PostMentionServiceImpl } from './service/impl/post-mention.service.impl';
import { PostMetaServiceImpl } from './service/impl/post-meta.service.impl';
import { PostSearchServiceImpl } from './service/impl/post-search.service.impl';
import { PostServiceImpl } from './service/impl/post.service.impl';
import { PostUserServiceImpl } from './service/impl/post-user.service.impl';
import { LIKE_SERVICE } from './service/like.service';
import { OVERVIEW_DECLINE_SERVICE } from './service/overview-decline.service';
import { POST_ACTION_SERVICE } from './service/post-action.service';
import { POST_FEED_SERVICE } from './service/post-feed.service';
import { POST_MENTION_SERVICE } from './service/post-mention.service';
import { POST_META_SERVICE } from './service/post-meta.service';
import { POST_SEARCH_SERVICE } from './service/post-search.service';
import { POST_USER_SERVICE } from './service/post-user.service';
import { POST_SERVICE } from './service/post.service';

@Module({
  imports: [JwtModule, RedisVersionModule, TransactionModule, AccessControlModule, GroupTeamModule, AiModule, UserModule],
  controllers: [PostController],
  providers: [
    { provide: POST_REPOSITORY, useClass: PostRepositoryImpl },
    { provide: POST_INTERACTION_REPOSITORY, useClass: PostInteractionRepositoryImpl },
    { provide: LIKE_REPOSITORY, useClass: LikeRepositoryImpl },
    { provide: TOPICS_POST_REPOSITORY, useClass: TopicsPostRepositoryImpl },
    { provide: POST_SERVICE, useClass: PostServiceImpl },
    { provide: POST_ACTION_SERVICE, useClass: PostActionServiceImpl },
    { provide: POST_FEED_SERVICE, useClass: PostFeedServiceImpl },
    { provide: POST_MENTION_SERVICE, useClass: PostMentionServiceImpl },
    { provide: POST_META_SERVICE, useClass: PostMetaServiceImpl },
    { provide: POST_SEARCH_SERVICE, useClass: PostSearchServiceImpl },
    { provide: POST_USER_SERVICE, useClass: PostUserServiceImpl },
    { provide: LIKE_SERVICE, useClass: LikeServiceImpl },
    { provide: OVERVIEW_DECLINE_SERVICE, useClass: OverviewDeclineServiceImpl },
    AnnouncementPolicy,
    PinPolicy,
    ExpirationPolicy,
    {
      provide: POST_CREATION_POLICIES,
      useFactory: (announcement: AnnouncementPolicy, pin: PinPolicy, expiration: ExpirationPolicy) => [announcement, pin, expiration],
      inject: [AnnouncementPolicy, PinPolicy, ExpirationPolicy],
    },
  ],
  exports: [POST_ACTION_SERVICE, POST_SEARCH_SERVICE, LIKE_SERVICE, POST_FEED_SERVICE, OVERVIEW_DECLINE_SERVICE],
})
export class PostModule {}
