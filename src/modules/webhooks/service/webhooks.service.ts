import { postMediaRepository } from '../../upload/repository/post-media.repository';
import type { MuxWebhooksResponseDto } from '../dto/response/mux.webhooks';

export const muxWebhooks = async (body: MuxWebhooksResponseDto) => {
  await postMediaRepository.updateMediaStatusByMuxWebhook(body);

  return {
    received: true,
  };
};