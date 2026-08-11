import { Module } from '@nestjs/common';
import { JwtModule } from '@/modules/jwt/jwt.module';
import { PostModule } from '@/modules/post/post.module';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminAuthRepository } from './auth/admin-auth.repository';
import { AdminAuthService } from './auth/admin-auth.service';
import { HashtagTrendingController } from './hashtag-trending/hashtag-trending.controller';
import { HashtagTrendingRepository } from './hashtag-trending/hashtag-trending.repository';
import { HashtagTrendingService } from './hashtag-trending/hashtag-trending.service';
import { ReportManagementController } from './report-management/report-management.controller';
import { ReportManagementRepository } from './report-management/report-management.repository';
import { ReportManagementService } from './report-management/report-management.service';
import { StatisticsController } from './statistics/statistics.controller';
import { StatisticsRepository } from './statistics/statistics.repository';
import { StatisticsService } from './statistics/statistics.service';
import { UserManagementController } from './user-management/user-management.controller';
import { UserManagementRepository } from './user-management/user-management.repository';
import { UserManagementService } from './user-management/user-management.service';

@Module({
  imports: [JwtModule, PostModule],
  controllers: [
    AdminAuthController,
    UserManagementController,
    ReportManagementController,
    HashtagTrendingController,
    StatisticsController,
  ],
  providers: [
    AdminRoleGuard,
    AdminAuthService,
    AdminAuthRepository,
    UserManagementService,
    UserManagementRepository,
    ReportManagementService,
    ReportManagementRepository,
    HashtagTrendingService,
    HashtagTrendingRepository,
    StatisticsService,
    StatisticsRepository,
  ],
})
export class AdminModule {}
