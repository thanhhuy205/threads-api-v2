import type { BaseResponse } from '@/shared/interface/base-response.interface';
import { CursorPaginationResponse } from '@/shared/pagination/cursor-pagination';

export type KnowledgePostCommentItemDataDto = {
    publicId: string;
    knowledgePostId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type KnowledgePostCommentCursorDataDto = CursorPaginationResponse<KnowledgePostCommentItemDataDto, string>

export type CreateKnowledgePostCommentResponseDto = BaseResponse<KnowledgePostCommentItemDataDto>;
export type GetKnowledgePostCommentResponseDto = BaseResponse<KnowledgePostCommentCursorDataDto>;
