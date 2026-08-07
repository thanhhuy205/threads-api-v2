import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { RefreshTokenHeaderGuard } from '@/common/guards/refresh-token-header.guard';
import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { VerificationRepository } from './repository/verification.repository';
import { AuthService } from './service/auth.service';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    VerificationRepository,
    AccessTokenGuard,
    RefreshTokenHeaderGuard,
  ],
})
export class AuthModule {}
