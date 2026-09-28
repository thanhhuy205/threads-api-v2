import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from './adapters/outbound/persistence/user.repository.impl';
import { UserGrpcController } from './adapters/inbound/grpc/user.grpc.controller';
import { UserController } from './adapters/inbound/http/user.controller';
import { USER_REPOSITORY } from './application/ports/inbound/user.repository';
import { UserServiceImpl } from './application/use-cases/impl/user.service.impl';
import { USER_SERVICE } from './application/use-cases/user.service';

@Module({
  controllers: [UserController, UserGrpcController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: USER_SERVICE, useClass: UserServiceImpl },
  ],
  exports: [USER_SERVICE],
})
export class ProfileModule { }
