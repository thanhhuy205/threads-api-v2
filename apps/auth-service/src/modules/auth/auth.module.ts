import { RefreshTokenStrategy } from '@auth-service/security/refresh-token.strategy';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthRepositoryImpl } from './repository/impl/auth.repository.impl';
import { VerificationRepositoryImpl } from './repository/impl/verification.repository.impl';
import { RefreshTokenRepositoryImpl } from './repository/impl/refresh-token.repository.impl';
import { REFRESH_TOKEN_REPOSITORY } from './repository/refresh-token.repository';
import { AUTH_REPOSITORY } from './repository/auth.repository';
import { VERIFICATION_REPOSITORY } from './repository/verification.repository';
import { AUTH_SERVICE } from './service/auth.service';
import { AuthServiceImpl } from './service/impl/auth.service.impl';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenRepositoryImpl },
    { provide: VERIFICATION_REPOSITORY, useClass: VerificationRepositoryImpl },
    { provide: AUTH_SERVICE, useClass: AuthServiceImpl },
    RefreshTokenStrategy,
  ],
})
export class AuthModule { }
