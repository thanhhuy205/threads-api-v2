import configService from '@/config/config';
import { embed } from 'ai';
import { createMixedbread } from 'mixedbread-ai-provider';


const mixedbread = createMixedbread({
    apiKey: configService.MIXEDBREAD_API_KEY,
});

async function main() {
    const { embedding } = await embed({
        model: mixedbread.textEmbeddingModel('mixedbread-ai/mxbai-embed-large-v1'),
        value: 'Tôi đang học Prisma, ExpressJS và semantic search',
    });

    console.log('Embedding dimensions:', embedding.length);
    console.log(embedding.slice(0, 5));
}

main();