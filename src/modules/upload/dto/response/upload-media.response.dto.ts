import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type UploadMediaItemDataDto = {
    id: number;
    key: string;
    url: string;
};

export type UploadMediaDataDto = {
    medias: UploadMediaItemDataDto[];
};

export type UploadMediaResponseDto = BaseResponse<UploadMediaDataDto>;