import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisVersionModule } from '@purse/core/redis-version';
import { TransactionModule } from '../../transaction/transaction.module';
import { PostActionController } from './adapters/inbound/http/post-action.controller';
import { PostUserController } from './adapters/inbound/http/post-user.controller';
import { PostController } from './adapters/inbound/http/post.controller';
import { GrpcUserReader } from './adapters/outbound/clients/user/grpc-user-reader';
import { USER_GRPC_CLIENT } from './adapters/outbound/clients/user/user.tokens';
import { GrpcMediaClient, MEDIA_GRPC_CLIENT } from './adapters/outbound/grpc/media/grpc-media.client';
// MAINTENANCE: import { AnnouncementPolicy } from './policies/announcement.policy';
// MAINTENANCE: import { ExpirationPolicy } from './policies/expiration.policy';
// MAINTENANCE: import { POST_CREATION_POLICIES } from './policies/interface/post-creation-policy.interface';
// MAINTENANCE: import { PinPolicy } from './policies/pin.policy';
// MAINTENANCE: import { LikeRepositoryImpl } from './adapters/outbound/persistence/like.repository.impl';
// MAINTENANCE: import { PostInteractionRepositoryImpl } from './adapters/outbound/persistence/post-interaction.repository.impl';
import { PrismaPostRepository } from './adapters/outbound/persistence/post.repository.impl';
// MAINTENANCE: import { TopicsPostRepositoryImpl } from './adapters/outbound/persistence/topics-post.repository.impl';
// MAINTENANCE: import { LIKE_REPOSITORY } from './application/ports/outbound/persistence/like.repository.port';
// MAINTENANCE: import { POST_INTERACTION_REPOSITORY } from './application/ports/outbound/persistence/interaction.repository.port';
import { MEDIA_PORT } from './application/ports/outbound/media.ports';
import { POST_REPOSITORY } from './application/ports/outbound/persistence/post.repository.port';
import { USER_READER } from './application/ports/outbound/user-reader.port';
// MAINTENANCE: import { TOPICS_POST_REPOSITORY } from './application/ports/outbound/persistence/topic.repository.port';
// MAINTENANCE: import { LikeServiceImpl } from './service/impl/like.service.impl';
import { PostActionServiceImpl } from './application/use-cases/post-action.service.impl';
import { PostFeedServiceImpl } from './application/use-cases/post-feed.service.impl';
// MAINTENANCE: import { PostMentionServiceImpl } from './service/impl/post-mention.service.impl';
// MAINTENANCE: import { PostMetaServiceImpl } from './service/impl/post-meta.service.impl';
import { PostSearchServiceImpl } from './application/use-cases/post-search.service.impl';
import { PostUserServiceImpl } from './application/use-cases/post-user.service.impl';
import { PostServiceImpl } from './application/use-cases/post.service.impl';
// MAINTENANCE: import { LIKE_SERVICE } from './application/ports/inbound/like.service';
import { POST_ACTION_SERVICE } from './application/ports/inbound/post-action.service';
import { POST_FEED_SERVICE } from './application/ports/inbound/post-feed.service';
// MAINTENANCE: import { POST_MENTION_SERVICE } from './application/ports/inbound/post-mention.service';
// MAINTENANCE: import { POST_META_SERVICE } from './application/ports/inbound/post-meta.service';
import { POST_SEARCH_SERVICE } from './application/ports/inbound/post-search.service';
import { POST_USER_SERVICE } from './application/ports/inbound/post-user.service';
import { POST_SERVICE } from './application/ports/inbound/post.service';

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
          loader: {
            keepCase: false,
            defaults: true,
          },
        },
      },
      {
        name: MEDIA_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          package: 'media',
          protoPath: require.resolve('@purse/proto/media.proto'),
          url: process.env.MEDIA_SERVICE_GRPC_URL ?? 'upload-service:5002',
          loader: {
            keepCase: false,
            defaults: true,
          },
        },
      },
    ]),
    RedisVersionModule,
    TransactionModule,
  ],
  controllers: [PostUserController, PostActionController, PostController],
  providers: [
    { provide: USER_READER, useClass: GrpcUserReader },
    { provide: MEDIA_PORT, useClass: GrpcMediaClient },
    { provide: POST_REPOSITORY, useClass: PrismaPostRepository },
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
    // MAINTENANCE: AnnouncementPolicy, PinPolicy, ExpirationPolicy,
    // MAINTENANCE: POST_CREATION_POLICIES factory,
  ],
  exports: [
    POST_ACTION_SERVICE,
    POST_SEARCH_SERVICE,
    POST_FEED_SERVICE,
    // MAINTENANCE: LIKE_SERVICE,
  ],
})
export class PostModule { }
