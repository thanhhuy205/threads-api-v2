import prisma from '@/config/prisma';
import type { MuxWebhooksResponseDto } from '@/modules/webhooks/dto/response/mux.webhooks';
import { PostMediaStatus, PostMediaType } from '@prisma/client';

export type PostMediaItemData = {
    id: number;
    key: string;
    url: string;
};

type CreatePostMediaInput = {
    key: string;
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'GIF' | 'OTHER';
    status: 'TEMPORARY' | 'UPLOADING' | 'UPLOADED' | 'FAILED';
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
                    },
                }),
            ),
        );

        return createdMedias.map((media, index) => ({
            id: media.id,
            key: mediaList[index].key,
            url: media.url,
        }));
    }

    async updateMediaStatusByMuxWebhook(body: MuxWebhooksResponseDto) {
        return prisma.postMedia.upsert({
            where: {
                key: body.data.id,
            },
            update: {
                url: body.data.playback_ids?.[0]?.id,
                type: PostMediaType.VIDEO,
                status:
                    body.data.status === 'ready'
                        ? PostMediaStatus.UPLOADED
                        : PostMediaStatus.UPLOADING,
            },

            create: {
                key: body.data.id,
                url: body.data.playback_ids?.[0]?.id,
                type: PostMediaType.VIDEO,
                status:
                    body.data.status === 'ready'
                        ? PostMediaStatus.UPLOADED
                        : PostMediaStatus.UPLOADING,
            },
        })
    }
}

export const postMediaRepository = new PostMediaRepository();
