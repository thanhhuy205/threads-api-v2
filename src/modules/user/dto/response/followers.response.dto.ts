import type { BaseResponse } from '@/shared/interface/base-response.interface';
import type { FollowerUserDto } from '../../mapper/follower.mapper';

export type GetFollowersDataDto = {
    followers: FollowerUserDto[];
};

export type GetFollowersResponseDto = BaseResponse<GetFollowersDataDto>;
