import type { BaseResponse } from '@/shared/interface/base-response.interface';
import { PostMediaStatus, PostMediaType } from '@prisma/client';

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

export type UploadMediaResponseDto = BaseResponse<UploadMediaDataDto>;