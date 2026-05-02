import configService from '@/config/config';
import { embed } from 'ai';
import { createMixedbread } from 'mixedbread-ai-provider';


const mixedbread = createMixedbread({
    apiKey: configService.MIXEDBREAD_API_KEY,
});


export async function generateEmbedding(content: string, topic: string[]): Promise<number[]> {
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