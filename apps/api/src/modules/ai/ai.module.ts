import { Module } from '@nestjs/common';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { AiController } from './controller/ai.controller';
import { AiService } from './service/ai.service';

@Module({
  controllers: [AiController],
  providers: [AiService, AccessTokenGuard],
})
export class AiModule {}
