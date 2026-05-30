import { postMediaRepository } from '../../upload/repository/post-media.repository';
import type { MuxWebhooksResponseDto } from '../dto/response/mux.webhooks';

export const muxWebhooks = async (body: MuxWebhooksResponseDto) => {
  if (body.type === 'video.asset.ready') {
    await postMediaRepository.updateMediaStatusByMuxWebhook(body);
  }

  return {
    received: true,
  };
};