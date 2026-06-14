import type { BaseResponse } from '@/shared/interface/base-response.interface';

export interface HlsWebhookResponseDataDto {
    received: boolean;
}

export type HlsWebhookResponseDto = BaseResponse<HlsWebhookResponseDataDto>;
