import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type UploadAvatarDataDto = {
    url: string;
};

export type UploadAvatarResponseDto = BaseResponse<UploadAvatarDataDto>;