import configService from '@/config/config';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: configService.PINECONE_API_KEY,
});

export const pineconeIndex = pc.Index(configService.PINECONE_INDEX_NAME);