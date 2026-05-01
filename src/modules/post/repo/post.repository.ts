export type CreatePostPayload = {
    title: string;
    content?: string;
    authorId?: string;
};

export type PostRecord = {
    id: string;
    title: string;
    content: string | null;
    authorId: string | null;
    createdAt: string;
};

class PostRepository {
    async create(payload: CreatePostPayload): Promise<PostRecord> {
        return {
            id: 'temp-post-id',
            title: payload.title,
            content: payload.content ?? null,
            authorId: payload.authorId ?? null,
            createdAt: new Date().toISOString(),
        };
    }

    async list(): Promise<PostRecord[]> {
        return [];
    }
}

export const postRepository = new PostRepository();
