import { JwtModule } from '@api/shared/jwt/jwt.module';
import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UsersController } from './controller/users.controller';
import { UserRepositoryImpl } from './repository/impl/user.repository.impl';
import { USER_REPOSITORY } from './repository/user.repository';
import { UserServiceImpl } from './service/impl/user.service.impl';
import { USER_SERVICE } from './service/user.service';

@Module({
  imports: [JwtModule],
  controllers: [UserController, UsersController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
    { provide: USER_SERVICE, useClass: UserServiceImpl },
  ],
  exports: [USER_SERVICE],
})
export class UserModule { }
