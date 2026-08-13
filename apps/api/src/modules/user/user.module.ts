import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { UserController } from './controller/user.controller';
import { UsersController } from './controller/users.controller';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [JwtModule],
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule { }
