
import { LLM_PROVIDER, LlmProvider } from '@api/modules/ai/provider/llm-provider.interface';
import { Inject, Injectable } from '@nestjs/common';


@Injectable()
export class AiService {
  constructor(
    @Inject(LLM_PROVIDER) private readonly llm: LlmProvider,
  ) { }


}

