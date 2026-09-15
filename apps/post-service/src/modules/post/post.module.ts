import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisVersionModule } from '@purse/core/redis-version';
import { GrpcUserReader } from '../../integrations/user/grpc-user-reader';
import { USER_GRPC_CLIENT } from '../../integrations/user/user.tokens';
import { TransactionModule } from '../../transaction/transaction.module';
import { PostController } from './controller/post.controller';
// MAINTENANCE: import { AnnouncementPolicy } from './policies/announcement.policy';
// MAINTENANCE: import { ExpirationPolicy } from './policies/expiration.policy';
// MAINTENANCE: import { POST_CREATION_POLICIES } from './policies/interface/post-creation-policy.interface';
// MAINTENANCE: import { PinPolicy } from './policies/pin.policy';
// MAINTENANCE: import { LikeRepositoryImpl } from './repository/impl/like.repository.impl';
// MAINTENANCE: import { PostInteractionRepositoryImpl } from './repository/impl/post-interaction.repository.impl';
import { PostRepositoryImpl } from './repository/impl/post.repository.impl';
// MAINTENANCE: import { TopicsPostRepositoryImpl } from './repository/impl/topics-post.repository.impl';
// MAINTENANCE: import { LIKE_REPOSITORY } from './repository/like.repository';
// MAINTENANCE: import { POST_INTERACTION_REPOSITORY } from './repository/post-interaction.repository';
import { POST_REPOSITORY } from './repository/post.repository';
import { USER_READER } from './ports/user-reader.port';
// MAINTENANCE: import { TOPICS_POST_REPOSITORY } from './repository/topics-post.repository';
// MAINTENANCE: import { LikeServiceImpl } from './service/impl/like.service.impl';
// MAINTENANCE: import { OverviewDeclineServiceImpl } from './service/impl/overview-decline.service.impl';
import { PostActionServiceImpl } from './service/impl/post-action.service.impl';
import { PostFeedServiceImpl } from './service/impl/post-feed.service.impl';
// MAINTENANCE: import { PostMentionServiceImpl } from './service/impl/post-mention.service.impl';
// MAINTENANCE: import { PostMetaServiceImpl } from './service/impl/post-meta.service.impl';
import { PostSearchServiceImpl } from './service/impl/post-search.service.impl';
import { PostUserServiceImpl } from './service/impl/post-user.service.impl';
import { PostServiceImpl } from './service/impl/post.service.impl';
// MAINTENANCE: import { LIKE_SERVICE } from './service/like.service';
// MAINTENANCE: import { OVERVIEW_DECLINE_SERVICE } from './service/overview-decline.service';
import { POST_ACTION_SERVICE } from './service/post-action.service';
import { POST_FEED_SERVICE } from './service/post-feed.service';
// MAINTENANCE: import { POST_MENTION_SERVICE } from './service/post-mention.service';
// MAINTENANCE: import { POST_META_SERVICE } from './service/post-meta.service';
import { POST_SEARCH_SERVICE } from './service/post-search.service';
import { POST_USER_SERVICE } from './service/post-user.service';
import { POST_SERVICE } from './service/post.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: require.resolve('@purse/proto/user.proto'),
          url: process.env.USER_SERVICE_GRPC_URL ?? 'auth-service:5001',
        },
      },
    ]),
    RedisVersionModule,
    TransactionModule,
  ],
  controllers: [PostController],
  providers: [
    { provide: USER_READER, useClass: GrpcUserReader },
    { provide: POST_REPOSITORY, useClass: PostRepositoryImpl },
    // MAINTENANCE: { provide: POST_INTERACTION_REPOSITORY, useClass: PostInteractionRepositoryImpl },
    // MAINTENANCE: { provide: LIKE_REPOSITORY, useClass: LikeRepositoryImpl },
    // MAINTENANCE: { provide: TOPICS_POST_REPOSITORY, useClass: TopicsPostRepositoryImpl },
    { provide: POST_SERVICE, useClass: PostServiceImpl },
    { provide: POST_ACTION_SERVICE, useClass: PostActionServiceImpl },
    { provide: POST_FEED_SERVICE, useClass: PostFeedServiceImpl },
    // MAINTENANCE: { provide: POST_MENTION_SERVICE, useClass: PostMentionServiceImpl },
    // MAINTENANCE: { provide: POST_META_SERVICE, useClass: PostMetaServiceImpl },
    { provide: POST_SEARCH_SERVICE, useClass: PostSearchServiceImpl },
    { provide: POST_USER_SERVICE, useClass: PostUserServiceImpl },
    // MAINTENANCE: { provide: LIKE_SERVICE, useClass: LikeServiceImpl },
    // MAINTENANCE: { provide: OVERVIEW_DECLINE_SERVICE, useClass: OverviewDeclineServiceImpl },
    // MAINTENANCE: AnnouncementPolicy, PinPolicy, ExpirationPolicy,
    // MAINTENANCE: POST_CREATION_POLICIES factory,
  ],
  exports: [
    POST_ACTION_SERVICE,
    POST_SEARCH_SERVICE,
    POST_FEED_SERVICE,
    // MAINTENANCE: LIKE_SERVICE, OVERVIEW_DECLINE_SERVICE,
  ],
})
export class PostModule { }
