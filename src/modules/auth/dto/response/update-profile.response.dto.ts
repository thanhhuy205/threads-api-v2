import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type UpdateProfileDataDto = {
    updated: boolean;
};

export type UpdateProfileResponseDto = BaseResponse<UpdateProfileDataDto>;