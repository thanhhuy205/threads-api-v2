import { postMediaRepository } from '../../upload/repository/post-media.repository';
export const muxWebhooks = async (body: unknown) => {
  await postMediaRepository.updateMediaStatusByMuxWebhook(body);

  return {
    received: true,
  };
};