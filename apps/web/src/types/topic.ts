

export type CreateTopicDto = {
    name: string;
};

export type TopicNameParamsDto = {
    name: string;
};

export type TopicItem = {
    name: string;
    count: number;
};

export type TopicSearchQueryDto = {
    q: string;
};

export type TopicSearchItem = {
    name: string;
    count?: number;
};

export type ApiSuccess<T> = {
    success: true;
    message?: string;
    data?: T;
};

export type ApiErrorResponse = {
    success: false;
    message?: string;
    errors?: unknown;
};

export type TopicListResponse = ApiSuccess<string[]>;
export type TopicItemResponse = ApiSuccess<TopicItem>;
export type TopicSearchResponse = ApiSuccess<TopicSearchItem[]>;
