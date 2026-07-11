export type HlsAssetStatus = 'ready' | 'errored' | 'deleted';

export type HlsWebhookEventType =
    | 'video.asset.ready'
    | 'video.asset.errored'
    | 'video.asset.deleted';

export interface HlsWebhookRequestDto {
    title: string;
    outputCloudDir: string;
    type: HlsWebhookEventType;
    data: {
        status: HlsAssetStatus;
        url: string;
        key: string;
    };
}
