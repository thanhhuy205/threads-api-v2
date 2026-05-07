export type KnowledgePostCommentMapperInput = {
    publicId: string;
    knowledgePostId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

export type KnowledgePostCommentRecord = {
    publicId: string;
    knowledgePostId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export const toRecord = (comment: KnowledgePostCommentMapperInput): KnowledgePostCommentRecord => {
    return {
        publicId: comment.publicId,
        knowledgePostId: comment.knowledgePostId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
    };
};
