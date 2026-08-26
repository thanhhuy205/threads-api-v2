import { RefreshTokenHeaderGuard } from '@/common/guards/refresh-token-header.guard';
import { JwtModule } from '@api/shared/jwt/jwt.module';
import { Module } from '@nestjs/common';
import { AbilityModule } from '@auth-service/modules/ability/ability.module';
import { AUTH_REPOSITORY } from '@user-service/modules/auth/repository/auth.repository';
import { UserModule } from '@user-service/modules/user/user.module';
import { AuthController } from './controller/auth.controller';
import { VerificationRepositoryImpl } from './repository/impl/verification.repository.impl';
import { VERIFICATION_REPOSITORY } from './repository/verification.repository';
import { AUTH_SERVICE } from './service/auth.service';
import { AuthServiceImpl } from './service/impl/auth.service.impl';

@Module({
  imports: [JwtModule, AbilityModule, UserModule],
  controllers: [AuthController],
  providers: [
    { provide: VERIFICATION_REPOSITORY, useClass: VerificationRepositoryImpl },
    { provide: AUTH_SERVICE, useClass: AuthServiceImpl },
    RefreshTokenHeaderGuard,
  ],
})
export class AuthModule { }
