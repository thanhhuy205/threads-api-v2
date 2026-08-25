import { PostMediaStatus, PostMediaType } from '@purse/upload-prisma-client';

export type UploadMediaItemDataDto = {
    id: number;
    key: string;
    url: string;
    type: PostMediaType;
    status: PostMediaStatus;
    width: number | null;
    height: number | null;
};

export type UploadMediaDataDto = {
    medias: UploadMediaItemDataDto[];
};

