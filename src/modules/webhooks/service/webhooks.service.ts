import { baseLogger } from '@/middlewares/logger';
import { postMediaRepository } from '@/modules/upload/repository/post-media.repository';
import type { MuxWebhooksResponseDto } from '@/modules/webhooks/dto/response/mux.webhooks';

class WebhooksService {
  async muxWebhooks(body: MuxWebhooksResponseDto) {
    if (body.type === 'video.asset.ready') {
      await postMediaRepository.updateMediaStatusByMuxWebhook(body);
    }

    return {
      received: true,
    };
  }

  async leonardoWebhooks(_body: unknown) {
    baseLogger.info(`Processing Leonardo webhook with body: ${JSON.stringify(_body)}`);


    return {
      received: true,
    };
  }
}

export const webhooksService = new WebhooksService();
