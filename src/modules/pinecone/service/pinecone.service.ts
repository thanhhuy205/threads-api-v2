import { SaveCirclePostEmbeddingInput, SavePostEmbeddingInput } from '@/modules/pinecone/dto/embedding-input.request.dto';
import { pineconeIndex } from '@/providers/pinecone.provider';
import { PostType } from '@prisma/client';


class PineconeService {
    async savePostEmbeddingToPinecone(input: SavePostEmbeddingInput) {
        await pineconeIndex.upsert({
            records: [
                {
                    id: `post:${input.postId}`,
                    values: input.embedding,
                    metadata: {
                        postId: input.postId,
                        userId: input.userId,
                        content: input.content,
                        topics: input.topics,
                        type: PostType.POST,
                    },
                },
            ],
            namespace: 'posts',
        });

        return {
            id: `post:${input.postId}`,
            namespace: 'posts',
        };
    }

    async saveCirclePostEmbeddingToPinecone(input: SaveCirclePostEmbeddingInput) {
        await pineconeIndex.upsert({
            records: [
                {
                    id: `circle_post:${input.postId}`,
                    values: input.embedding,
                    metadata: {
                        postId: input.postId,
                        circlePostId: input.postId,
                        userId: input.userId,
                        content: input.content,
                        topics: input.topics,
                        type: PostType.CIRCLE,
                    },
                },
            ],
            namespace: 'posts',
        });

        return {
            id: `circle_post:${input.postId}`,
            namespace: 'posts',
        };
    }

    async querySimilarPosts(embedding: number[], topK: number = 10) {
        const queryResponse = await pineconeIndex.query({
            vector: embedding,
            topK,
            includeMetadata: true,
            namespace: 'posts',
        });

        return queryResponse.matches?.map((match) => ({
            postId: match.metadata?.postId,
            userId: match.metadata?.userId,
            content: match.metadata?.content,
            topics: match.metadata?.topics,
            score: match.score,
        })) || [];
    }

}

export const pineconeService = new PineconeService();