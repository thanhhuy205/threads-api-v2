import { RefreshTokenHeaderGuard } from '@/common/guards/refresh-token-header.guard';
import { Module } from '@nestjs/common';
import { AbilityModule } from '../ability/ability.module';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthRepositoryImpl } from './repository/impl/auth.repository.impl';
import { VerificationRepositoryImpl } from './repository/impl/verification.repository.impl';
import { AUTH_REPOSITORY } from './repository/auth.repository';
import { VERIFICATION_REPOSITORY } from './repository/verification.repository';
import { AuthServiceImpl } from './service/impl/auth.service.impl';
import { AUTH_SERVICE } from './service/auth.service';

@Module({
  imports: [JwtModule, AbilityModule, UserModule],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
    { provide: VERIFICATION_REPOSITORY, useClass: VerificationRepositoryImpl },
    { provide: AUTH_SERVICE, useClass: AuthServiceImpl },
    RefreshTokenHeaderGuard,
  ],
})
export class AuthModule { }
