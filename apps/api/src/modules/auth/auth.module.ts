import { RefreshTokenHeaderGuard } from '@/common/guards/refresh-token-header.guard';
import { Module } from '@nestjs/common';
import { AbilityModule } from '../ability/ability.module';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { VerificationRepository } from './repository/verification.repository';
import { AuthService } from './service/auth.service';

@Module({
  imports: [JwtModule, AbilityModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    VerificationRepository,
    RefreshTokenHeaderGuard,
  ],
})
export class AuthModule { }
