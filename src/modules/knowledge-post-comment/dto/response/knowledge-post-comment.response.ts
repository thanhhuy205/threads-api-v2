import type { BaseResponse } from '@/shared/interface/base-response.interface';

export type KnowledgePostCommentItemDataDto = {
    id: string;
    knowledgePostId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type KnowledgePostCommentCursorDataDto = {
    rows: KnowledgePostCommentItemDataDto[];
    pageInfo: {
        take: number;
        after: string | null;
        hasMore: boolean;
    };
};

export type CreateKnowledgePostCommentResponseDto = BaseResponse<KnowledgePostCommentItemDataDto>;
export type GetKnowledgePostCommentResponseDto = BaseResponse<KnowledgePostCommentCursorDataDto>;
