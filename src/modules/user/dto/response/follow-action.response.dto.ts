import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type FollowActionDataDto = {
    isFollowing: boolean;
};

export type FollowActionResponseDto = BaseResponse<FollowActionDataDto>;
