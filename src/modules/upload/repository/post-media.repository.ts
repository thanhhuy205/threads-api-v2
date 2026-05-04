import prisma from '@/config/prisma';

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
}

export const postMediaRepository = new PostMediaRepository();
