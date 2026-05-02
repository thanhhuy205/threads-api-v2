import { mixedbread } from "@/providers/mixedbread.provider";
import { embed } from "ai";

class MixedBreadService {
    async generateEmbedding(content: string, topic: string[]): Promise<number[]> {
        try {
            const value = `Content: ${content}\nTopic: ${topic.join(', ')}`;
            const response = await embed({
                model: mixedbread.textEmbeddingModel('mixedbread-ai/mxbai-embed-large-v1'),
                value,
                providerOptions: {
                    mixedbread: {
                        normalized: true,
                        dimensions: 1024,
                    },
                },
            });
            return response.embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw error;
        }
    }

    async generateEmbeddingForPost(content: string, topic: string[]): Promise<number[]> {
        return this.generateEmbedding(content, topic);
    }
}

export const mixedBreadService = new MixedBreadService();