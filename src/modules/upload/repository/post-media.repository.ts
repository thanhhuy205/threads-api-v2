import prisma from '@/config/prisma';
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

    async updateMediaStatus(body: {
        status: PostMediaStatus;
        key: string;
        url?: string;
    }) {

        return prisma.postMedia.updateMany({
            where: {
                key: body.key,
            },
            data: {
                status: body.status,
                ...(body.url ? { url: body.url } : {}),
            },
        })
    }
}

export const postMediaRepository = new PostMediaRepository();
