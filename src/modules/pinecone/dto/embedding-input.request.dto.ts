export type SavePostEmbeddingInput = {
    postId: number;
    userId: string;
    content: string;
    topics: string[];
    embedding: number[];
};
