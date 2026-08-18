import { GroqProvider } from '@api/modules/ai/provider/grod.provder';
import { LLM_PROVIDER } from '@api/modules/ai/provider/llm-provider.interface';
import { Module } from '@nestjs/common';
import { AiController } from './controller/ai.controller';
import { AiService } from './service/ai.service';

@Module({
  controllers: [AiController],
  providers: [AiService, {
    provide: LLM_PROVIDER,
    useClass: GroqProvider,
  }],
  exports: [AiService],
})
export class AiModule { }
