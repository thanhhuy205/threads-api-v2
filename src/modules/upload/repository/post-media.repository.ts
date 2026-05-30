import prisma from '@/config/prisma';
import { baseLogger } from '@/middlewares/logger';
import type { MuxWebhooksResponseDto } from '@/modules/webhooks/dto/response/mux.webhooks';
import { PostMediaStatus, PostMediaType } from '@prisma/client';

export type PostMediaItemData = {
    id: number;
    key: string;
    url: string;
    type: PostMediaType;
    status: PostMediaStatus;
    width: number | null;
    height: number | null;
};

type CreatePostMediaInput = {
    key: string;
    url: string;
    type: PostMediaType;
    status: PostMediaStatus;
    width: number | null;
    height: number | null;
};

class PostMediaRepository {
    async createMedia(mediaList: CreatePostMediaInput[]): Promise<PostMediaItemData[]> {
        const createdMedias = await prisma.$transaction(
            mediaList.map((media) =>
                prisma.postMedia.create({
                    data: media as any,
                    select: {
                        id: true,
                        url: true,
                        width: true,
                        height: true,
                    },
                }),
            ),
        );

        return createdMedias.map((media, index) => ({
            id: media.id,
            key: mediaList[index].key,
            type: mediaList[index].type,
            url: media.url,
            status: mediaList[index].status,
            width: media.width,
            height: media.height,
        }));
    }

    async updateMediaStatusByMuxWebhook(body: MuxWebhooksResponseDto) {
        baseLogger.info(`Updating media status for Mux webhook: ${JSON.stringify(body)}`);
        const uploadId = body.data.upload_id;
        const playbackId = body.data.playback_ids?.[0]?.id;
        const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`;
        return prisma.postMedia.upsert({
            where: {
                key: uploadId,
            },
            update: {
                url: hlsUrl,
                type: PostMediaType.VIDEO,
                status:
                    body.data.status === 'ready'
                        ? PostMediaStatus.UPLOADED
                        : PostMediaStatus.UPLOADING,
            },

            create: {
                key: uploadId,
                url: body.data.playback_ids?.[0]?.id,
                type: PostMediaType.VIDEO,
                status:
                    body.data.status === 'ready'
                        ? PostMediaStatus.UPLOADED
                        : PostMediaStatus.UPLOADING,
                width: null,
                height: null,
            },
        })
    }
}

export const postMediaRepository = new PostMediaRepository();
