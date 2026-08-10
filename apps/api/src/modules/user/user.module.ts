import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { TransactionModule } from '@/shared/transaction/transaction.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { UserFollowController } from './controller/user-follow.controller';
import { UserController } from './controller/user.controller';
import { UsersController } from './controller/users.controller';
import { FollowRepository } from './repository/follow.repository';
import { FriendRequestRepository } from './repository/friend-request.repository';
import { UserRepository } from './repository/user.repository';
import { FollowerService } from './service/follower.service';
import { FriendService } from './service/friend.service';
import { UserService } from './service/user.service';

@Module({
  imports: [TransactionModule, JwtModule],
  controllers: [UserController, UsersController, UserFollowController],
  providers: [
    UserService,
    FriendService,
    FollowerService,
    UserRepository,
    FriendRequestRepository,
    FollowRepository,
    AccessTokenGuard,
  ],
  exports: [UserService, FriendService, FollowerService, UserRepository],
})
export class UserModule { }
