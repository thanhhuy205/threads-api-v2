import { Module } from '@nestjs/common';
import { AUTH_REPOSITORY } from './repository/auth.repository';
import { AuthRepositoryImpl } from './repository/impl/auth.repository.impl';

@Module({
  providers: [{ provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl }],
  exports: [AUTH_REPOSITORY],
})
export class AuthRepositoryModule {}
