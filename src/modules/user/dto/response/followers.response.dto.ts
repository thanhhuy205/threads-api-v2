import type { BaseResponse } from '@/shared/interface/base-response.interface';
import type { UserProfile } from '../../repository/user.repository';

export type FollowerUserDto = Pick<UserProfile, 'id' | 'username' | 'name' | 'verifiedAt'>;

export type GetFollowersDataDto = {
    followers: FollowerUserDto[];
};

export type GetFollowersResponseDto = BaseResponse<GetFollowersDataDto>;