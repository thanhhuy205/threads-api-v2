import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type StatusProfileDataDto = {
  isSuccessFollow: boolean;
  isSuccessBio: boolean;
  isSuccessPost: boolean;
  isSuccessAvatar: boolean;
};

export type StatusProfileResponseDto = BaseResponse<StatusProfileDataDto>;
