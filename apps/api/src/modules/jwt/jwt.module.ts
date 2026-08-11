import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService as AppJwtService } from './service/jwt.service';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_CONFIG.JWT_SECRET'),
        signOptions: { algorithm: 'HS256' },
      }),
    }),
  ],
  providers: [AppJwtService],
  exports: [AppJwtService],
})
export class JwtModule { }
