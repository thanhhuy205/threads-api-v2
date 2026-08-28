import { RefreshTokenStrategy } from '@auth-service/security/refresh-token.strategy';
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { VerificationRepositoryImpl } from './repository/impl/verification.repository.impl';
import { VERIFICATION_REPOSITORY } from './repository/verification.repository';
import { AUTH_SERVICE } from './service/auth.service';
import { AuthServiceImpl } from './service/impl/auth.service.impl';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: VERIFICATION_REPOSITORY, useClass: VerificationRepositoryImpl },
    { provide: AUTH_SERVICE, useClass: AuthServiceImpl },
    RefreshTokenStrategy,
  ],
})
export class AuthModule { }
