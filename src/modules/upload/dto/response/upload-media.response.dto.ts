import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type UploadMediaDataDto = {
    urls: string[];
};

export type UploadMediaResponseDto = BaseResponse<UploadMediaDataDto>;