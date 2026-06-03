import { baseLogger } from '@/middlewares/logger';
import { webhookPreviewImageRepository } from '@/modules/ai/repository/webhook-preview-image.repository';
import { pusherService } from '@/modules/pusher/service/pusher.service';
import { postMediaRepository } from '@/modules/upload/repository/post-media.repository';
import type { MuxWebhooksResponseDto } from '@/modules/webhooks/dto/response/mux.webhooks';
import type { LeonardoWebhookPayload } from '@/providers/leonardo.types';
import { Prisma } from '@prisma/client';

class WebhooksService {
  async muxWebhooks(body: MuxWebhooksResponseDto) {
    if (body.type === 'video.asset.ready') {
      await postMediaRepository.updateMediaStatusByMuxWebhook(body);
    }

    return {
      received: true,
    };
  }

  async leonardoWebhooks(_body: LeonardoWebhookPayload) {
    baseLogger.info(`Processing Leonardo webhook with body: ${JSON.stringify(_body)}`);
    if (_body.object !== 'generation') {
      return {
        received: true,
      };
    }

    const result = await webhookPreviewImageRepository.updateMetadataByGenerationId(
      _body.data.object.id,
      _body.data.object as Prisma.InputJsonValue,
    );

    if (!result) {
      baseLogger.warn(
        `No WebHookPreviewImage found for Leonardo generation ${_body.data.object.id}`,
      );
    }

    baseLogger.info(`Leonardo webhook processing completed for generation ID: ${JSON.stringify(result)}`);

    pusherService.trigger("public-generate-" + _body.data.object.id, "leonardo-generation-complete", {
      generationId: _body.data.object.id,
      images: _body.data.object.images || null,
    });

    return {
      received: true,
    };
  }
}

export const webhooksService = new WebhooksService();
