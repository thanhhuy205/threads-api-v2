import { Module } from '@nestjs/common';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { RefreshTokenHeaderGuard } from '@/common/guards/refresh-token-header.guard';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenGuard, RefreshTokenHeaderGuard],
})
export class AuthModule {}
