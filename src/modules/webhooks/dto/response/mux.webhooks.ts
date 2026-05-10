export interface MuxWebhookPlaybackIdDto {
    id: string;
    policy: string;
}

export interface MuxWebhookObjectDto {
    type: 'asset';
    id: string;
}

export interface MuxWebhookDataDto {
    status: 'ready';
    playback_ids: MuxWebhookPlaybackIdDto[];
    duration: number;
    id: string;
}

export interface MuxWebhooksResponseDto {
    type: 'video.asset.ready';
    created_at: string;
    object: MuxWebhookObjectDto;
    data: MuxWebhookDataDto;
    accessor_source: string | null;
    request_id: string;
}