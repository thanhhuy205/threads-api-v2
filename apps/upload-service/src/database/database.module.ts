import { Global, Module } from '@nestjs/common';
import { UploadPrismaService } from './prisma.service';

@Global()
@Module({
  providers: [UploadPrismaService],
  exports: [UploadPrismaService],
})
export class UploadDatabaseModule {}
