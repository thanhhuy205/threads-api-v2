import { PostModule } from '@post-service/modules/post/post.module';
import { JwtModule } from '@api/shared/jwt/jwt.module';
import { Module } from '@nestjs/common';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { HashtagTrendingController } from './hashtag-trending/hashtag-trending.controller';
import { HashtagTrendingRepository } from './hashtag-trending/hashtag-trending.repository';
import { HashtagTrendingService } from './hashtag-trending/hashtag-trending.service';
// User management has moved to user-service.
// import { UserManagementController } from './user-management/user-management.controller';
// import { UserManagementRepository } from './user-management/user-management.repository';
// import { UserManagementService } from './user-management/user-management.service';

@Module({
  imports: [JwtModule, PostModule],
  controllers: [
    // UserManagementController,
    HashtagTrendingController,
  ],
  providers: [
    AdminRoleGuard,
    // UserManagementService,
    // UserManagementRepository,
    HashtagTrendingService,
    HashtagTrendingRepository,
  ],
})
export class AdminModule { }
