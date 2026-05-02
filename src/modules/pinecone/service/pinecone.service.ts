// src/services/pinecone.service.ts
import { SavePostEmbeddingInput } from '@/modules/pinecone/dto/embedding-input.request.dto';
import { pineconeIndex } from '@/providers/pinecone.provider';
import { PostType } from '@prisma/client';


export async function savePostEmbeddingToPinecone(input: SavePostEmbeddingInput) {
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