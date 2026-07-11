export type SavePostEmbeddingInput = {
    postId: number;
    userId: string;
    content: string;
    topics: string[];
    embedding: number[];
};

export type SaveCirclePostEmbeddingInput = {
    circleId: number;
    postId: number;
    userId: string;
    content: string;
    topics: string[];
    embedding: number[];
};
