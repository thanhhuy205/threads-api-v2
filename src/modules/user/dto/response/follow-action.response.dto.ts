import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type FollowActionDataDto = {
    following: boolean;
};

export type FollowActionResponseDto = BaseResponse<FollowActionDataDto>;